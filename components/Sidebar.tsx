import React from 'react';
import { Article } from '../types';

interface SidebarProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ articles, onArticleClick }) => {
  return (
    <aside className="bg-gray-50 lg:bg-transparent p-4 lg:p-0 rounded lg:rounded-none border border-gray-100 lg:border-none lg:border-l lg:border-gray-200 lg:pl-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 border-b border-black pb-2">
          <h3 className="font-sans font-bold text-lg uppercase text-gray-900">Must Read</h3>
          <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
        </div>

        {/* List */}
        <div className="flex flex-col space-y-6">
          {articles.map((article, idx) => (
            <div 
              key={article.id} 
              className="group cursor-pointer flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              onClick={() => onArticleClick(article)}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-black font-serif text-lg group-hover:bg-brand-red group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <div>
                {/* Hover Effect: Text stays black, Red underline animates L->R */}
                <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 font-serif line-clamp-3">
                  <span className="hover-underline-animation">
                    {article.headline}
                  </span>
                </h4>
                <div className="flex items-center text-[10px] text-gray-400 uppercase font-medium mt-1">
                  <span className="text-brand-red mr-2">{article.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Widget */}
        <div className="mt-10 bg-gray-900 p-6 text-center rounded-sm relative overflow-hidden">
           <div className="relative z-10">
             <h4 className="text-white font-bold font-serif text-xl mb-2">Stay Updated</h4>
             <p className="text-gray-400 text-xs mb-4">Get the latest auto news delivered to your inbox.</p>
             <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-sm mb-2 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-brand-red" />
             <button className="w-full bg-brand-red text-white uppercase font-bold text-xs py-2 hover:bg-red-700 transition-colors">Subscribe</button>
           </div>
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-red rounded-full opacity-20"></div>
        </div>
    </aside>
  );
};

export default Sidebar;