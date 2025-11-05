import React from 'react';
import CampaignGenerator from './components/CampaignGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Email Campaign Generator
            </h1>
            <span className="text-sm text-gray-400">Powered by Gemini</span>
          </div>
        </div>
      </header>
      <main>
        <CampaignGenerator />
      </main>
    </div>
  );
};

export default App;
