import React from 'react';
import { Article } from '../types';

interface HeroSectionProps {
  article: Article;
  onClick: (article: Article) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ article, onClick }) => {
  return (
    <div 
      className="group cursor-pointer relative" 
      onClick={() => onClick(article)}
    >
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-sm">
        <img 
          src={`https://picsum.photos/seed/${article.imageSeed}/1600/900`} 
          alt={article.headline}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-4/5 lg:w-2/3">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Breaking
            </span>
            <span className="text-gray-300 text-xs font-bold uppercase tracking-wider border-l pl-2 border-gray-500">
              {article.category}
            </span>
          </div>
          
          {/* Hover Effect: Text stays white, Red underline animates L->R */}
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-lg">
            <span className="hover-underline-animation pb-1">
              {article.headline}
            </span>
          </h2>
          
          <p className="text-gray-200 font-sans text-base md:text-lg line-clamp-2 mb-4 hidden md:block opacity-90">
            {article.summary}
          </p>
          
          <div className="flex items-center text-gray-400 text-xs uppercase font-bold tracking-wider">
             <span className="text-white">{article.author}</span>
             <span className="mx-2 text-brand-red">•</span>
             <span>{article.publishedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;