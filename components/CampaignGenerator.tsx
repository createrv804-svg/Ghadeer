import React, { useState, useCallback } from 'react';
import { generateCampaignContent, generateCampaignImage } from '../services/geminiService';
import type { CampaignResult } from '../types';
import Loader from './Loader';
import GeneratedCampaign from './GeneratedCampaign';
import { SparklesIcon } from './icons/SparklesIcon';
import ChatBot from './ChatBot';

const CampaignGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [campaignResult, setCampaignResult] = useState<CampaignResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for your campaign.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCampaignResult(null);

    try {
      const [content, imageUrl] = await Promise.all([
        generateCampaignContent(prompt),
        generateCampaignImage(prompt)
      ]);
      
      setCampaignResult({ ...content, imageUrl });

    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const examplePrompts = [
    "A flash sale on summer dresses",
    "Launch of a new vegan protein powder",
    "Early-bird tickets for a tech conference",
    "A webinar on digital marketing trends"
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-cyan-300 mb-4">1. Describe Your Campaign</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A flash sale for 25% off all summer clothing for the next 48 hours."
          className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-shadow duration-200 resize-none"
          disabled={isLoading}
        />
        
        <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Or try an example:</p>
            <div className="flex flex-wrap gap-2">
                {examplePrompts.map((p) => (
                    <button 
                        key={p}
                        onClick={() => setPrompt(p)}
                        disabled={isLoading}
                        className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 px-3 py-1 rounded-full transition-colors"
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon />
              Generate Campaign
            </>
          )}
        </button>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-purple-300 mb-4">2. Your Generated Campaign</h2>
        <div className="bg-gray-800/50 rounded-xl min-h-[60vh] border border-gray-700 backdrop-blur-sm overflow-hidden">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Loader size="lg"/>
                <p className="mt-4 text-lg font-semibold text-gray-300">Crafting your campaign...</p>
                <p className="text-sm text-gray-400">This might take a moment, especially the image.</p>
             </div>
          ) : (
             <GeneratedCampaign result={campaignResult} />
          )}
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default CampaignGenerator;
