import React, { useEffect, useState } from 'react';
import { searchLiveNews } from '../services/geminiService';
import { SearchResult } from '../types';

interface SearchResultsModalProps {
  query: string | null;
  onClose: () => void;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ query, onClose }) => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchLiveNews(query).then(data => {
        setResult(data);
        setLoading(false);
      });
    } else {
        setResult(null);
    }
  }, [query]);

  if (!query) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] rounded-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h2 className="text-lg font-bold font-sans text-gray-800 flex items-center gap-2">
                <span className="text-brand-red">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"></path></svg>
                </span>
                Results for: "{query}"
             </h2>
             <button onClick={onClose} className="text-gray-400 hover:text-brand-red transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : result ? (
            <div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p className="whitespace-pre-wrap leading-relaxed">{result.text}</p>
              </div>
              
              {result.sources.length > 0 && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Source References</h4>
                  <ul className="space-y-2">
                    {result.sources.map((source, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-red mt-1">•</span>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-700 hover:underline truncate w-full block"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsModal;