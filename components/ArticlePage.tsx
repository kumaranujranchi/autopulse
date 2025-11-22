import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { generateFullArticle } from '../services/geminiService';
import Sidebar from './Sidebar';
import NewsGrid from './NewsGrid';
import SectionHeader from './SectionHeader';

interface ArticlePageProps {
  article: Article;
  allArticles: Article[]; // Passed for "Related" and "Latest" suggestions
  onBack: () => void;
  onArticleClick: (article: Article) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, allArticles, onBack, onArticleClick }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    generateFullArticle(article.headline)
      .then(text => {
        setContent(text);
        setLoading(false);
      });
  }, [article]);

  // Derive related content (simulated using slice)
  const relatedArticles = allArticles.slice(0, 4); 
  const latestPosts = allArticles.slice(2, 5);
  const recommendedPosts = allArticles.slice(4, 7);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-2 mb-6">
        <div className="container mx-auto px-4 text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
          <button onClick={onBack} className="hover:text-brand-red">Home</button>
          <span>/</span>
          <span className="text-brand-red">{article.category}</span>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-[200px]">{article.headline}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-10">
          
          {/* === Main Article Content (Left 70%) === */}
          <div className="w-full lg:w-[70%]">
            
            {/* Headline & Meta */}
            <h1 className="text-3xl md:text-5xl font-serif font-black text-gray-900 leading-tight mb-4">
              {article.headline}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-100 py-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                   <img src={`https://picsum.photos/seed/${article.imageSeed + 5}/100`} alt={article.author} />
                 </div>
                 <div className="text-xs">
                    <p className="font-bold text-gray-900 uppercase">By {article.author}</p>
                    <p className="text-gray-500">Updated: {article.publishedTime}</p>
                 </div>
              </div>
              
              {/* Social Share Placeholder */}
              <div className="flex gap-2 mt-3 sm:mt-0">
                {['Facebook', 'Twitter', 'WhatsApp'].map(platform => (
                  <button key={platform} className="text-[10px] font-bold uppercase bg-gray-100 hover:bg-brand-red hover:text-white px-3 py-1.5 rounded transition-colors">
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <figure className="mb-8">
              <img 
                src={`https://picsum.photos/seed/${article.imageSeed}/1200/675`} 
                alt={article.headline}
                className="w-full h-auto object-cover rounded-sm"
              />
              <figcaption className="text-xs text-gray-500 mt-2 italic">
                Representative image for {article.headline}. Source: AutoPulse Archives.
              </figcaption>
            </figure>

            {/* Article Body */}
            <div className="max-w-none">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-50 rounded w-full my-6"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-a:text-brand-red prose-img:rounded-sm text-gray-800"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>

            {/* Bottom Section 1: Latest Posts */}
            <div className="mt-16 pt-8 border-t-4 border-black">
              <SectionHeader title="Latest Posts" />
              <NewsGrid articles={latestPosts} onArticleClick={onArticleClick} />
            </div>

             {/* Bottom Section 2: You Should Also See This */}
            <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 p-6 rounded-sm">
              <h3 className="text-xl font-serif font-bold mb-6 text-gray-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-red block"></span>
                You should also see this
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {recommendedPosts.map(post => (
                   <div key={post.id} onClick={() => onArticleClick(post)} className="group cursor-pointer">
                      <div className="aspect-video mb-3 overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${post.imageSeed}/400/250`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          alt={post.headline}
                        />
                      </div>
                      <h4 className="font-serif font-bold text-sm leading-snug group-hover:text-brand-red group-hover:underline decoration-brand-red underline-offset-2">
                        {post.headline}
                      </h4>
                   </div>
                 ))}
              </div>
            </div>

          </div>

          {/* === Sidebar (Right 30%) === */}
          <div className="w-full lg:w-[30%] mt-12 lg:mt-0">
            <div className="sticky top-24">
               <div className="mb-8">
                 <SectionHeader title="Related Articles" />
                 <Sidebar articles={relatedArticles} onArticleClick={onArticleClick} />
               </div>
               
               {/* Ad Unit */}
               <div className="w-full h-[600px] bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <span className="font-bold tracking-widest">ADVERTISEMENT</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticlePage;