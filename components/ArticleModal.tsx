import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { generateFullArticle } from '../services/geminiService';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setLoading(true);
      generateFullArticle(article.headline)
        .then(text => {
            setContent(text);
            setLoading(false);
        });
    } else {
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 rounded-full p-2 text-gray-800 hover:bg-brand-red hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <img 
          src={`https://picsum.photos/seed/${article.imageSeed}/1200/600`} 
          alt={article.headline}
          className="w-full h-64 sm:h-80 object-cover"
        />

        <div className="p-8 sm:p-10">
          <div className="flex items-center space-x-2 mb-4 text-xs font-bold uppercase tracking-widest">
             <span className="text-brand-red">{article.category}</span>
             <span className="text-gray-300">|</span>
             <span className="text-gray-500">{article.publishedTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-gray-900 mb-6 leading-tight">
            {article.headline}
          </h1>

          <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
               <img src={`https://picsum.photos/seed/${article.author.length}/100`} alt="Author" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">By {article.author}</p>
              <p className="text-xs text-gray-500">AutoPulse Senior Editor</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-32 bg-gray-100 rounded w-full my-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none font-serif text-gray-800 prose-headings:font-sans prose-headings:font-bold prose-a:text-brand-red"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
