import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import 'katex/dist/katex.min.css';
import Navbar from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
export const metadata = {
  title: "Quiz Application",
  description: "Upload JSON and Take Quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-sans antialiased" suppressHydrationWarning>
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800 sticky top-0 z-50">
          <div className="w-full mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center font-bold font-serif shadow-lg shadow-blue-500/20">Q</div>
               <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">QuizEngine</span>
             </div>
             <Navbar />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
