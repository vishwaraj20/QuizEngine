"use client";
import { useEffect, useState, Suspense } from 'react';
import { BookOpen, Search, Filter, Play, Star, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

// Hardcoded books list
const MOCK_BOOKS = [
  {
    id: 'tcs-aptitude',
    title: 'TCS Aptitude Question Bank',
    author: 'CampusQuest Prep',
    category: 'Quantitative Aptitude',
    color: 'from-indigo-500 to-blue-600',
    pdf_url: '/materials/TCS_text/Tcs aptitude question bank (44pgs).pdf',
    pages: 44,
    description: 'A comprehensive collection of quantitative and logical reasoning questions frequently asked in TCS placements.'
  },
  {
    id: 'rs-aggarwal-quant',
    title: 'Quantitative Aptitude',
    author: 'R.S. Aggarwal',
    category: 'Quantitative Aptitude',
    color: 'from-amber-500 to-orange-600',
    pdf_url: '/materials/aptitude/rs-aggarwal.pdf',
    pages: 'Full',
    description: 'The definitive guide for quantitative aptitude covering all essential topics.'
  },
  {
    id: 'verbal-non-verbal-reasoning',
    title: 'Verbal & Non-Verbal Reasoning',
    author: 'LearnGuide.in',
    category: 'Logical Reasoning',
    color: 'from-purple-500 to-fuchsia-600',
    pdf_url: '/materials/aptitude/verbal-non-verbal-reasoning.pdf',
    pages: 'Full',
    description: 'A complete guide to mastering verbal and non-verbal reasoning skills for competitive exams.'
  }
];

const CATEGORIES = ['All', 'Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Data Interpretation'];

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full mx-auto z-10 relative">
        {/* Header */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-12"
        >
           <p className="text-amber-600 font-black uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
             <BookOpen className="w-4 h-4" /> Built-in PDF Reader
           </p>
           <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Aptitude Library</h1>
           <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-2xl">Access all your placement prep books, formulas, and study materials directly in the browser. Auto-sync your reading progress across devices.</p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-sm">
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 scrollbar-hide">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                   activeCategory === cat 
                     ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                     : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          
          <div className="relative w-full md:w-72 flex-shrink-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search books, authors..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400"
             />
          </div>
        </div>

        {/* Book Grid */}
        {filteredBooks.length === 0 ? (
           <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No books found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
             {filteredBooks.map((book, i) => (
               <motion.div 
                 key={book.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <Link href={`/dashboard/aptitude-library/${book.id}`} className="block group">
                   <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 relative">
                     
                     {/* Cover Image Container */}
                     <div className={`relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br ${book.color || 'from-gray-700 to-gray-900'} flex items-center justify-center p-6 text-center`}>
                        {book.cover_url ? (
                          <img 
                            src={book.cover_url} 
                            alt={book.title} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                             <h2 className="text-white font-black text-2xl md:text-3xl drop-shadow-md group-hover:scale-105 transition-transform duration-500">{book.title}</h2>
                          </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Read Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                             <Play className="w-6 h-6 ml-1" />
                           </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                           {book.category}
                        </div>
                     </div>

                     {/* Details */}
                     <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-amber-500 transition-colors">
                           {book.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{book.author}</p>
                        
                        <div className="mt-auto flex items-center justify-between text-xs font-bold text-gray-400">
                           <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                              {book.pages} Pages
                           </div>
                        </div>
                     </div>
                   </div>
                 </Link>
               </motion.div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}

export default function AptitudeLibraryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="font-medium text-lg">Loading Library...</p>
      </div>
    }>
      <LibraryContent />
    </Suspense>
  );
}
