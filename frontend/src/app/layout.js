import "./globals.css";
import Navbar from "@/components/Navbar";
export const metadata = {
  title: "Quiz Application",
  description: "Upload JSON and Take Quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased" suppressHydrationWarning>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold font-serif shadow">Q</div>
               <span className="font-bold text-xl tracking-tight text-gray-900">QuizEngine</span>
             </div>
             <Navbar />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
