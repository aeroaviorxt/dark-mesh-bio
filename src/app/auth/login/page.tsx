'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Github, Disc } from 'lucide-react'; // Assuming 'Disc' for Discord or similar generic icon if not available

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">LOADING AUTH MODULE...</div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const source = searchParams.get('source');
    const next = searchParams.get('next') || (source === 'guestbook' ? '/guestbook' : '/docs/admin');
    const supabase = createClient();

    useEffect(() => {
        if (!source) {
            router.push('/');
        }
    }, [source, router]);

    const handleGithubLogin = async () => {
        const origin = window.location.origin;
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${origin}/auth/callback?next=${next}`,
            },
        });
    };

    const handleDiscordLogin = async () => {
        const origin = window.location.origin;
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${origin}/auth/callback?next=${next}`,
            },
        });
    };

    if (!source) return null;

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-mono">
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#333_0%,#000_70%)]"></div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl text-center space-y-8">
                <div>
                    <h1 className="text-xl font-bold tracking-[0.2em] uppercase mb-2">
                        {source === 'guestbook' ? 'GUESTBOOK_ACCESS' : 'SYSTEM_ADMIN_GATEWAY'}
                    </h1>
                    <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                        {source === 'guestbook' ? 'AUTHENTICATION_REQUIRED' : 'PRIORITY_ACCESS_ONLY'}
                    </p>
                </div>

                {source === 'guestbook' && (
                    <button
                        onClick={handleGithubLogin}
                        className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                    >
                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                        Connect_Via_Github
                    </button>
                )}

                {source === 'admin' && (
                    <button
                        onClick={handleDiscordLogin}
                        className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group"
                    >
                        {/* Discord Icon SVG manually since lucide might not have it or it's named differently */}
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.486 13.486 0 0 0-.64 1.28 17.683 17.683 0 0 0-5.751 0 14.15 14.15 0 0 0-.64-1.28.077.077 0 0 0-.08-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                        Authenticate_Via_Discord
                    </button>
                )}
            </div>
        </main>
    );
}
