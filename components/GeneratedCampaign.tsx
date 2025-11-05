import React from 'react';
import type { CampaignResult } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeneratedCampaignProps {
  result: CampaignResult | null;
}

const GeneratedCampaign: React.FC<GeneratedCampaignProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="p-4 bg-gray-700/50 rounded-full mb-4">
            <SparklesIcon className="h-8 w-8 text-cyan-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-200">Your campaign will appear here</h3>
        <p className="text-gray-400 mt-2">
          Describe your campaign goal in the panel on the left and click "Generate Campaign" to get started.
        </p>
      </div>
    );
  }

  const { imageUrl, subjectLines, body } = result;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {imageUrl ? (
        <div className="mb-8 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
          <img src={imageUrl} alt="Campaign Visual" className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="mb-8 rounded-lg bg-gray-700 animate-pulse w-full aspect-video flex items-center justify-center">
            <p className="text-gray-500">Generating image...</p>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Subject Line Suggestions</h3>
        <ul className="space-y-2 list-none p-0">
          {subjectLines.map((subject, index) => (
            <li key={index} className="bg-gray-900/70 p-3 rounded-md border border-gray-700 text-gray-300">
              <span className="font-mono text-cyan-400 mr-2">{index + 1}.</span> {subject}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Email Body Preview</h3>
        <div 
            className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 prose-strong:text-cyan-300 prose-a:text-purple-400 p-4 bg-gray-900 rounded-lg border border-gray-700"
            dangerouslySetInnerHTML={{ __html: body }} 
        />
      </div>
    </div>
  );
};

export default GeneratedCampaign;
