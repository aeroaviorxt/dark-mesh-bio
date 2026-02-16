import Link from 'next/link';
import { BookOpen, ArrowRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPublishedDocs } from '@/app/actions/docs';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Technical Library & Documentation | avrxt',
    description: 'Explore in-depth technical guides, architectural deep dives, and performance optimization tutorials by avrxt.',
    keywords: ['technical documentation', 'coding tutorials', 'system architecture', 'software engineering guides', 'avrxt library'],
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Docs() {
    const articles = await getPublishedDocs();

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-white/10 selection:text-white pt-20">
            <header className="sticky top-16 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-[#333]/50 h-16 flex items-center">
                <nav className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold tracking-[0.2em] font-mono text-white">DOCS_LIBRARY</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/docs/admin" className="text-xs border border-[#333] px-4 py-2 rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 font-mono flex items-center gap-2">
                            <Settings size={12} /> /admin
                        </Link>
                        <Link href="/#expertise" className="text-xs border border-[#333] px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-mono">
                            /back_to_stack
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20">
                <section className="animate-fade-in mb-20">
                    <p className="text-sm text-cyan-400 mb-4 tracking-widest font-mono">/SYSTEM_DOCUMENTATION</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        The avrxt Library
                    </h1>
                    <p className="text-xl text-gray-400 max-w-4xl leading-relaxed">
                        Explore our collection of in-depth technical guides, architectural deep dives, and performance optimization tutorials for modern systems.
                    </p>
                    <div className="mt-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
                        {articles.length} ARTICLES PUBLISHED | LAST UPDATE: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </div>
                </section>

                <hr className="border-[#333]/50 mb-16" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-10 font-mono flex items-center gap-3">
                        <BookOpen className="text-purple-500 w-6 h-6" /> Featured Articles
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/docs/${article.slug}`}
                                    className={cn(
                                        "interactive-panel bg-white/[0.02] border border-[#333] rounded-xl transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl h-full group",
                                        article.color === 'blue' && "hover:border-blue-500",
                                        article.color === 'cyan' && "hover:border-cyan-500",
                                        article.color === 'purple' && "hover:border-purple-500",
                                        article.color === 'green' && "hover:border-green-500",
                                        article.color === 'orange' && "hover:border-orange-500",
                                        article.color === 'pink' && "hover:border-pink-500"
                                    )}
                                >
                                    <div className="p-8 h-full flex flex-col justify-between">
                                        <div>
                                            <span className={cn(
                                                "text-[10px] font-mono border px-3 py-1 rounded-full mb-6 inline-block uppercase tracking-widest",
                                                article.color === 'blue' && "text-blue-400 border-blue-500/30 bg-blue-900/10",
                                                article.color === 'cyan' && "text-cyan-400 border-cyan-500/30 bg-cyan-900/10",
                                                article.color === 'purple' && "text-purple-400 border-purple-500/30 bg-purple-900/10",
                                                article.color === 'green' && "text-green-400 border-green-500/30 bg-green-900/10",
                                                article.color === 'orange' && "text-orange-400 border-orange-500/30 bg-orange-900/10",
                                                article.color === 'pink' && "text-pink-400 border-pink-500/30 bg-pink-900/10"
                                            )}>
                                                {article.category}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                                {article.description}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-gray-800">
                                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
                                                {article.date}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-zinc-500 font-mono text-sm">No articles found in the database.</p>
                                <p className="text-zinc-600 text-xs mt-2">Check Supabase connection or publish a document.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
