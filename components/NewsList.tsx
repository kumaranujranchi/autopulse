import React from 'react';
import { Article } from '../types';

interface NewsListProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

const NewsList: React.FC<NewsListProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="flex flex-col space-y-6">
      {articles.map((article) => (
        <div 
          key={article.id} 
          className="group cursor-pointer flex flex-row items-start gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          onClick={() => onArticleClick(article)}
        >
          <div className="relative w-1/3 aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 flex-shrink-0">
            <img 
              src={`https://picsum.photos/seed/${article.imageSeed}/400/300`} 
              alt={article.headline}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="flex flex-col w-2/3">
            <span className="text-[10px] font-bold uppercase text-brand-red mb-1 tracking-wider">
              {article.category}
            </span>
            {/* Hover Effect: Text stays black, Red underline animates L->R */}
            <h3 className="text-base font-serif font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
              <span className="hover-underline-animation">
                {article.headline}
              </span>
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 font-sans line-clamp-2 mb-2">
              {article.summary}
            </p>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              {article.publishedTime}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;