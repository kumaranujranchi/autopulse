import React from 'react';

interface SectionHeaderProps {
  title: string;
  href?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, href = "#" }) => {
  return (
    <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-2">
      <div className="flex items-center border-l-4 border-brand-red pl-3">
        <h2 className="text-xl font-sans font-bold uppercase text-gray-800 tracking-tight">
          {title}
        </h2>
      </div>
      <a href={href} className="text-xs font-bold text-brand-red hover:text-gray-900 uppercase flex items-center">
        View All 
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </a>
    </div>
  );
};

export default SectionHeader;