import React, { useState } from 'react';
import { NewsCategory } from '../types';

interface HeaderProps {
  activeCategory: NewsCategory;
  onCategoryChange: (cat: NewsCategory) => void;
  onSearch: (query: string) => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, onSearch, onLogoClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <>
      {/* Utility Bar */}
      <div className="bg-white border-b border-gray-200 text-[11px] text-gray-500 font-sans py-1 px-4 hidden md:flex justify-between items-center">
        <div className="flex space-x-4">
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <span className="border-l pl-4 border-gray-300">New Delhi 28°C</span>
        </div>
        <div className="flex space-x-4 font-bold text-gray-600 uppercase">
          <a href="#" className="hover:text-brand-red">E-Paper</a>
          <a href="#" className="hover:text-brand-red">Newsletter</a>
          <a href="#" className="hover:text-brand-red">App</a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5">
            
            {/* Logo Section */}
            <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
              <div className="flex items-center gap-3">
                 <button 
                  className="md:hidden p-1 text-gray-800"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div 
                  onClick={onLogoClick}
                  className="cursor-pointer text-center md:text-left group"
                >
                  <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tighter text-gray-900 group-hover:text-brand-red transition-colors leading-none">
                    AUTO<span className="text-brand-red">PULSE</span>
                  </h1>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-500 mt-1">India's #1 Auto News</p>
                </div>
              </div>
            </div>

            {/* Advertisement or Search (Simplified to Search for this app) */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto relative">
               <input 
                  type="text" 
                  placeholder="Search reviews, cars, bikes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 lg:w-80 pl-4 pr-10 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-brand-red transition-all"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-brand-red">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"></path></svg>
                </button>
            </form>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex border-t border-b border-gray-100 py-3 justify-center space-x-8 font-sans text-sm font-bold uppercase text-gray-700">
             {Object.values(NewsCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`relative group transition-colors ${
                  activeCategory === cat ? 'text-brand-red' : 'hover:text-black'
                }`}
              >
                {cat}
                <span className={`absolute -bottom-3 left-0 w-full h-0.5 bg-brand-red transform scale-x-0 transition-transform duration-200 ${activeCategory === cat ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full z-50">
             {Object.values(NewsCategory).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-4 font-bold text-sm uppercase border-b border-gray-100 ${
                     activeCategory === cat ? 'text-brand-red bg-red-50' : 'text-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;