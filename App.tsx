import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SectionHeader from './components/SectionHeader';
import NewsGrid from './components/NewsGrid';
import NewsList from './components/NewsList';
import Sidebar from './components/Sidebar';
import ArticlePage from './components/ArticlePage';
import SearchResultsModal from './components/SearchResultsModal';
import { fetchNewsFeed } from './services/geminiService';
import { Article, NewsCategory } from './types';

// --- Dummy Data Generators for Structure ---
const generateDummyArticles = (category: string, count: number, startId: number): Article[] => {
  const templates = [
    { title: "2025 Facelift Revealed", summary: "The highly anticipated update brings fresh styling and a new hybrid powertrain option to the lineup." },
    { title: "Performance Edition Launched", summary: "With 200hp on tap and upgraded suspension, this new variant targets enthusiasts." },
    { title: "First Drive Review", summary: "We take it for a spin on the twisties to see if the handling claims hold up in the real world." },
    { title: "Price Hike Announced", summary: "Input costs drive up prices across the entire range effective from next month." },
    { title: "Spy Shots: New Generation", summary: "Camouflaged test mules spotted testing in high altitude regions, revealing larger dimensions." }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `dummy-${category}-${startId + i}`,
      headline: `${category} ${template.title}`,
      summary: template.summary,
      category: category,
      author: "AutoPulse Team",
      publishedTime: `${i + 2}h ago`,
      imageSeed: startId + i * 13
    };
  });
};

// Static launch data (Specific buckets)
const CAR_LAUNCH_DATA = generateDummyArticles("New Car", 4, 200);
const BIKE_LAUNCH_DATA = generateDummyArticles("New Bike", 4, 300);

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.ALL);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'article'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  // Dynamic Content Helpers
  const isAll = activeCategory === NewsCategory.ALL;
  const isCars = activeCategory === NewsCategory.CARS;
  const isBikes = activeCategory === NewsCategory.BIKES;

  // Generate Trending data dynamically based on category
  const trendingArticles = useMemo(() => {
    const prefix = isAll ? 'Trending' : activeCategory;
    return generateDummyArticles(prefix, 4, 100);
  }, [activeCategory, isAll]);

  // Initial load and category change
  useEffect(() => {
    if (currentView === 'article') {
        setCurrentView('home');
        setSelectedArticle(null);
    }

    const loadNews = async () => {
      setLoading(true);
      const data = await fetchNewsFeed(activeCategory);
      setArticles(data);
      setLoading(false);
    };
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    setCurrentView('home');
  };

  const heroArticle = articles.length > 0 ? articles[0] : null;
  // For Home: Grid gets slice(1). For Category: List gets slice(1) + specific launches
  let latestNewsArticles = articles.length > 1 ? articles.slice(1) : [];

  // If we are in specific categories, enrich the main feed with the static launch data
  if (isCars) latestNewsArticles = [...latestNewsArticles, ...CAR_LAUNCH_DATA];
  if (isBikes) latestNewsArticles = [...latestNewsArticles, ...BIKE_LAUNCH_DATA];
  
  // Sidebar content
  const sidebarArticles = [...articles.slice(0, 2), ...trendingArticles.slice(0, 3)]; 
  
  // Combine all for recommendations in Article Page
  const allAvailableArticles = [...articles, ...trendingArticles, ...CAR_LAUNCH_DATA, ...BIKE_LAUNCH_DATA];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
        onLogoClick={() => {
            setActiveCategory(NewsCategory.ALL);
            handleBackToHome();
        }}
      />

      <main className="flex-grow py-6 md:py-8">
        
        {currentView === 'article' && selectedArticle ? (
          <ArticlePage 
            article={selectedArticle} 
            allArticles={allAvailableArticles}
            onBack={handleBackToHome}
            onArticleClick={handleArticleClick}
          />
        ) : (
          <div className="container mx-auto px-4">
            {loading && articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Curating latest {activeCategory} news...</p>
              </div>
            ) : (
              <>
                {/* =================================================================================
                    LAYOUT SWITCHER
                    Home View: Grid Heavy, Horizontal Strips
                    Category View: List Heavy (River), Dedicated Sidebar, Distinct Header
                   ================================================================================= */}

                {isAll ? (
                  /* === HOME LAYOUT === */
                  <div className="flex flex-col lg:flex-row lg:space-x-8">
                    <div className="w-full lg:w-3/4">
                      {/* 1. Hero */}
                      {heroArticle && (
                        <section className="mb-10">
                          <HeroSection article={heroArticle} onClick={handleArticleClick} />
                        </section>
                      )}

                      {/* 2. Horizontal Trending Strip */}
                      <section className="mb-10">
                        <SectionHeader title="Trending Now" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {trendingArticles.map((article) => (
                            <div key={article.id} onClick={() => handleArticleClick(article)} className="group cursor-pointer">
                                <div className="overflow-hidden rounded-sm mb-2 aspect-[3/2]">
                                  <img 
                                    src={`https://picsum.photos/seed/${article.imageSeed}/300/200`} 
                                    alt={article.headline}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <h4 className="text-sm font-bold font-serif leading-tight text-gray-900">
                                  <span className="hover-underline-animation">{article.headline}</span>
                                </h4>
                            </div>
                          ))}
                        </div>
                      </section>
                      
                      {/* 3. Grid for Latest News */}
                      <section className="mb-12">
                        <SectionHeader title="Latest News" />
                        <NewsGrid articles={latestNewsArticles} onArticleClick={handleArticleClick} />
                      </section>

                      {/* 4. Split Launch Sections */}
                      <section className="grid md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                          <div>
                              <SectionHeader title="New Car Launches" />
                              <NewsList articles={CAR_LAUNCH_DATA} onArticleClick={handleArticleClick} />
                          </div>
                          <div>
                              <SectionHeader title="New Bike Launches" />
                              <NewsList articles={BIKE_LAUNCH_DATA} onArticleClick={handleArticleClick} />
                          </div>
                      </section>
                    </div>

                    {/* Home Sidebar */}
                    <div className="w-full lg:w-1/4 mt-10 lg:mt-0">
                      <Sidebar articles={sidebarArticles} onArticleClick={handleArticleClick} />
                    </div>
                  </div>

                ) : (
                  
                  /* === CATEGORY LAYOUT === */
                  <div>
                     {/* Category Banner */}
                     <div className="border-b-4 border-brand-red mb-8 pb-2 mt-2">
                        <div className="flex items-end gap-4">
                            <h1 className="text-4xl md:text-6xl font-black font-serif text-gray-900 uppercase tracking-tighter leading-none">
                                {activeCategory}
                            </h1>
                            <span className="hidden md:inline-block text-brand-red font-bold text-lg pb-1.5 mb-0.5">/ News & Reviews</span>
                        </div>
                        <p className="text-gray-500 font-sans font-bold text-xs md:text-sm mt-2 uppercase tracking-widest">
                            Top stories, expert reviews, and market analysis for {activeCategory}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:space-x-10">
                      {/* Left Col - Main Feed (List View distinct from Home Grid) */}
                      <div className="w-full lg:w-2/3">
                          {heroArticle && (
                              <div className="mb-10">
                                <HeroSection article={heroArticle} onClick={handleArticleClick} />
                              </div>
                          )}

                          <SectionHeader title={`Latest in ${activeCategory}`} />
                          
                          {/* Using List View for the entire feed gives a "Blog/Archive" feel */}
                          <div className="mt-6">
                             <NewsList articles={latestNewsArticles} onArticleClick={handleArticleClick} />
                          </div>
                      </div>

                      {/* Right Col - Category Sidebar */}
                      <div className="w-full lg:w-1/3 mt-10 lg:mt-0">
                          <div className="sticky top-24">
                              <SectionHeader title="Most Popular" />
                              <Sidebar articles={trendingArticles} onArticleClick={handleArticleClick} />
                              
                              {/* Category Specific Widget */}
                              <div className="mt-8 bg-gray-900 p-6 text-center text-white rounded-sm">
                                  <h4 className="font-serif font-bold text-xl mb-2">
                                    {isCars ? 'Find Your Dream Car' : isBikes ? 'Find Your Dream Bike' : 'Industry Insights'}
                                  </h4>
                                  <p className="text-xs text-gray-400 mb-4">
                                    Compare specs, prices, and features with our advanced tools.
                                  </p>
                                  <button className="bg-brand-red text-white w-full text-xs font-bold uppercase py-3 hover:bg-red-700 transition-colors">
                                    Start Search
                                  </button>
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>

      <footer className="bg-gray-900 text-white py-10 mt-12 border-t-4 border-brand-red">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-black mb-4">AUTO<span className="text-brand-red">PULSE</span></h2>
          <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-6">
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Advertise</a>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} AutoPulse News Media. All rights reserved.</p>
        </div>
      </footer>
      
      <SearchResultsModal 
        query={searchQuery} 
        onClose={() => setSearchQuery(null)} 
      />
    </div>
  );
};

export default App;