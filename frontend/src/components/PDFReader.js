"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Bookmark, Search, Maximize, Minimize, Settings, X, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client for progress syncing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Setting up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFReader({ bookId, pdfUrl, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      fetchProgress(user.id);
    } else {
      setIsReady(true);
    }
  }, []);

  const fetchProgress = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('user_book_progress')
        .select('last_page_read, bookmarks')
        .eq('user_id', uid)
        .eq('book_id', bookId)
        .single();
      
      if (data) {
        if (data.last_page_read) setPageNumber(data.last_page_read);
        if (data.bookmarks) setBookmarks(data.bookmarks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReady(true);
    }
  };

  const saveProgress = async (newPage) => {
    if (!userId) return;
    try {
      // Upsert progress
      await supabase
        .from('user_book_progress')
        .upsert(
          { user_id: userId, book_id: bookId, last_page_read: newPage, bookmarks, updated_at: new Date() },
          { onConflict: 'user_id, book_id' }
        );
    } catch (e) {
      console.error(e);
    }
  };

  const saveBookmarks = async (newBookmarks) => {
    if (!userId) return;
    try {
      await supabase
        .from('user_book_progress')
        .upsert(
          { user_id: userId, book_id: bookId, last_page_read: pageNumber, bookmarks: newBookmarks, updated_at: new Date() },
          { onConflict: 'user_id, book_id' }
        );
    } catch (e) {
      console.error(e);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      saveProgress(newPage);
      return newPage;
    });
  };

  const handlePageInput = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 1 && val <= numPages) {
      setPageNumber(val);
      saveProgress(val);
    }
  };

  const toggleBookmark = () => {
    let newBookmarks = [...bookmarks];
    if (bookmarks.includes(pageNumber)) {
      newBookmarks = bookmarks.filter(b => b !== pageNumber);
    } else {
      newBookmarks.push(pageNumber);
      newBookmarks.sort((a,b) => a - b);
    }
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="font-medium text-lg">Loading Book Data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-gray-100 dark:bg-[#0f1623] text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black tracking-tight line-clamp-1">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
            <span className="px-3 text-xs font-bold w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3.0, s + 0.1))} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
          </div>

          <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-2"></div>

          {/* Tools */}
          <button onClick={toggleBookmark} className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${bookmarks.includes(pageNumber) ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'}`} title="Bookmark Page">
            <Bookmark className="w-5 h-5" fill={bookmarks.includes(pageNumber) ? "currentColor" : "none"} />
          </button>
          <button onClick={toggleFullscreen} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-200 dark:bg-slate-950 p-4 sm:p-8 custom-scrollbar relative">
        
        {/* Bookmarks Sidebar - Desktop */}
        {bookmarks.length > 0 && (
          <div className="hidden lg:block absolute left-8 top-8 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><Bookmark className="w-4 h-4"/> Bookmarks</h3>
             <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               {bookmarks.map(bm => (
                 <button 
                   key={bm} 
                   onClick={() => { setPageNumber(bm); saveProgress(bm); }}
                   className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${bm === pageNumber ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                 >
                   Page {bm}
                 </button>
               ))}
             </div>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center drop-shadow-2xl"
          loading={
            <div className="flex flex-col items-center justify-center mt-32 text-gray-500">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
               <p className="font-bold">Loading PDF Document...</p>
            </div>
          }
        >
          <Page 
             pageNumber={pageNumber} 
             scale={scale} 
             className="bg-white dark:bg-slate-800"
             renderTextLayer={true}
             renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 p-4 flex items-center justify-center shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-6 bg-gray-100 dark:bg-slate-800 p-2 rounded-2xl">
           <button 
             disabled={pageNumber <= 1} 
             onClick={() => changePage(-1)}
             className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 dark:hover:bg-slate-600 hover:text-amber-600 transition-colors"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>

           <div className="flex items-center gap-2 font-bold text-lg">
             <input 
               type="number" 
               value={pageNumber} 
               onChange={handlePageInput}
               className="w-16 text-center bg-transparent border-b-2 border-gray-300 dark:border-slate-600 focus:border-amber-500 outline-none pb-1"
               min={1}
               max={numPages || 1}
             />
             <span className="text-gray-400">/ {numPages || '--'}</span>
           </div>

           <button 
             disabled={pageNumber >= numPages} 
             onClick={() => changePage(1)}
             className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 dark:hover:bg-slate-600 hover:text-amber-600 transition-colors"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles for this page */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}} />
    </div>
  );
}
