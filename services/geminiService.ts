import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TEXT_MODEL_NAME, IMAGE_MODEL_NAME } from '../constants';
import type { CampaignData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

export async function generateCampaignContent(prompt: string): Promise<CampaignData> {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: `You are an expert email marketing copywriter. Based on the following prompt, generate a complete email marketing campaign. Prompt: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLines: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A compelling subject line for the email."
              },
              description: "A list of 3-5 subject line options."
            },
            body: {
              type: Type.STRING,
              description: "The full email body copy in HTML format. Use paragraphs, headings, bold text, and lists to make it engaging and readable. Do not include <html> or <body> tags."
            },
          },
          required: ["subjectLines", "body"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedData: CampaignData = JSON.parse(jsonString);
    return parsedData;

  } catch (error) {
    console.error("Error generating campaign content:", error);
    throw new Error("Failed to generate campaign content. Please check the console for details.");
  }
}

export async function generateCampaignImage(prompt: string): Promise<string> {
  try {
    const imagePrompt = `A vibrant and professional marketing visual for: ${prompt}. Clean, minimalist, high-quality, 4k cinematic, photorealistic.`;
    
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL_NAME,
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating campaign image:", error);
    throw new Error("Failed to generate campaign image. The model may have safety restrictions.");
  }
}


export async function getChatResponse(message: string): Promise<string> {
    if (!chat) {
        chat = ai.chats.create({
            model: TEXT_MODEL_NAME,
            config: {
                systemInstruction: 'You are a friendly marketing assistant chatbot. Help users refine their campaign ideas or answer general marketing questions.'
            }
        });
    }

    try {
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error in chat response:", error);
        chat = null; // Reset chat on error
        throw new Error("Failed to get chat response.");
    }
}
