import React from 'react';
import { Article } from '../types';

interface NewsGridProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {articles.map((article) => (
        <div 
          key={article.id} 
          className="group cursor-pointer flex flex-col border-b border-gray-100 sm:border-none pb-6 sm:pb-0"
          onClick={() => onArticleClick(article)}
        >
          <div className="relative overflow-hidden mb-4 aspect-video rounded-sm bg-gray-100">
            <img 
              src={`https://picsum.photos/seed/${article.imageSeed}/800/600`} 
              alt={article.headline}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom red bar removed as we have specific headline underline request, but keeping generic subtle cues is okay. Removing per request for clean headline focus. */}
          </div>
          
          <div className="flex flex-col flex-grow">
            {/* Hover Effect: Text stays black, Red underline animates L->R */}
            <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-2">
              <span className="hover-underline-animation">
                {article.headline}
              </span>
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-sans mb-3">
              {article.summary}
            </p>
            
            <div className="mt-auto pt-2 flex justify-between items-center text-[11px] text-gray-400 uppercase font-bold tracking-wide">
              <span>{article.publishedTime}</span>
              <span className="text-gray-900 group-hover:text-brand-red flex items-center transition-colors">
                Read <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsGrid;