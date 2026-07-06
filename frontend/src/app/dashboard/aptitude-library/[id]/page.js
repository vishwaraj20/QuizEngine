"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Using the same mock data to find the URL
const MOCK_BOOKS = [
  {
    id: 'tcs-aptitude',
    title: 'TCS Aptitude Question Bank',
    pdf_url: '/materials/TCS_text/Tcs aptitude question bank (44pgs).pdf'
  },
  {
    id: 'rs-aggarwal-quant',
    title: 'Quantitative Aptitude for Competitive Examinations',
    pdf_url: '/materials/aptitude/rs-aggarwal.pdf'
  },
  {
    id: 'verbal-non-verbal-reasoning',
    title: 'Verbal & Non-Verbal Reasoning',
    pdf_url: '/materials/aptitude/verbal-non-verbal-reasoning.pdf'
  }
];

export default function AptitudeBookReaderPage() {
  const params = useParams();
  const bookId = params.id;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = MOCK_BOOKS.find(b => b.id === bookId);
    setBook(found);
    setLoading(false);
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="font-medium text-lg">Loading Book...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Book Not Found</h1>
        <Link href="/dashboard/aptitude-library" className="px-4 py-2 bg-amber-500 text-white rounded-lg">Return to Library</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0f1623] text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/aptitude-library" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black tracking-tight line-clamp-1">{book.title}</h1>
        </div>
      </div>

      {/* Simple PDF Viewer (Native Browser Iframe) */}
      <div className="flex-1 w-full overflow-hidden">
         <iframe 
           src={`${book.pdf_url}#view=FitH`} 
           className="w-full h-full border-none"
           title={book.title}
         />
      </div>
    </div>
  );
}
