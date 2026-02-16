'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Github, Mail, Play, Pause, Camera, BookOpen, ExternalLink, ArrowRight, ChevronRight, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeConfig } from '@/lib/me-config';

const iconMap: Record<string, any> = {
    Instagram, Github, Mail, Camera, BookOpen, ExternalLink, ArrowRight, ChevronRight, Share2
};

interface MeClientProps {
    initialConfig: MeConfig;
}

export default function MeClient({ initialConfig }: MeClientProps) {
    // We can just use initialConfig if we don't expect real-time updates without refresh
    // Or satisfy TypeScript:
    const config = initialConfig;

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isImmersive, setIsImmersive] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (!isNaN(audio.duration)) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setIsImmersive(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().catch(() => { /* Auto-play policy might block */ });
            setIsPlaying(true);
            setIsImmersive(true);
        } else {
            audio.pause();
            setIsPlaying(false);
            setIsImmersive(false);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const value = parseFloat(e.target.value);
        audio.currentTime = (value / 100) * audio.duration;
        setProgress(value);
    };

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubscribeStatus({ type: null, message: '' });

        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            if (response.ok) {
                setSubscribeStatus({ type: 'success', message: '// SUCCESS: NOTE_RESERVED' });
                (e.target as HTMLFormElement).reset();
            } else {
                setSubscribeStatus({ type: 'error', message: `// ERROR: ${result.error || 'Denied'}` });
            }
        } catch (error) {
            setSubscribeStatus({ type: 'error', message: '// ERROR: UPLINK_LOST' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={cn(
            "min-h-screen bg-black text-white relative flex flex-col items-center select-none overflow-x-hidden pt-16 pb-12",
            isImmersive && "immersive-mode"
        )}>
            {/* Background Decor */}
            <div className={cn(
                "fixed inset-0 z-0 transition-all duration-1000",
                isImmersive ? "blur-2xl brightness-[0.3]" : ""
            )}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a1a_0%,#000_70%)]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay"></div>
            </div>

            <div className="relative z-20 w-full max-w-md px-6 flex flex-col items-center">
                {/* Profile Header */}
                <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="mb-6 relative inline-block">
                        <div className="absolute inset-0 z-10" onTouchStart={(e) => e.preventDefault()}></div>
                        <img
                            src={config.profile.avatarUrl}
                            alt="avrxt"
                            className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-white/10 shadow-2xl pointer-events-none"
                        />
                    </div>
                    <h1 className="text-2xl font-bold font-mono tracking-[0.15em] uppercase text-white">{config.profile.handle}</h1>
                    <p className="text-sm font-light tracking-[0.2em] text-zinc-400 mt-3 uppercase italic">{config.profile.bio}</p>

                    {/* Status Indicator */}
                    {config.profile.status && config.profile.status.text && (
                        <div className={cn(
                            "mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-black/50 backdrop-blur-md",
                            config.profile.status.color === 'green' && "border-emerald-500/30 text-emerald-400",
                            config.profile.status.color === 'yellow' && "border-yellow-500/30 text-yellow-400",
                            config.profile.status.color === 'red' && "border-red-500/30 text-red-400",
                            config.profile.status.color === 'blue' && "border-blue-500/30 text-blue-400",
                            config.profile.status.color === 'purple' && "border-purple-500/30 text-purple-400",
                        )}>
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                config.profile.status.color === 'green' && "bg-emerald-500",
                                config.profile.status.color === 'yellow' && "bg-yellow-500",
                                config.profile.status.color === 'red' && "bg-red-500",
                                config.profile.status.color === 'blue' && "bg-blue-500",
                                config.profile.status.color === 'purple' && "bg-purple-500",
                            )}></span>
                            <span className="text-[10px] font-mono uppercase tracking-widest">{config.profile.status.text}</span>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                <div className="w-full mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1 block">Social_Connections</span>
                    <div className="space-y-3">
                        {config.links.map((link, idx) => {
                            const isCustomIcon = link.icon && (link.icon.startsWith('http') || link.icon.startsWith('/') || link.icon.startsWith('data:'));

                            if (link.icon === 'Discord' || link.name === 'Discord') {
                                return (
                                    <Link key={link.id} href={link.url} target="_blank" className="link-card flex items-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.07] transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="w-5 h-5 mr-4 fill-zinc-400"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6,0.48,80.21a105.73,105.73,0,0,0,32.28,16.15,77.7,77.7,0,0,0,7.37-12,67.39,67.39,0,0,1-11.87-5.65c0.99-.71,2-1.47,3-2.25a74.61,74.61,0,0,0,64.74,0c1,0.78,2,1.54,3,2.25a67.49,67.49,0,0,1-11.89,5.65,77.83,77.83,0,0,0,7.38,12,105.51,105.51,0,0,0,32.31-16.15C130.58,50.46,126.1,26.79,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
                                        <span className="text-sm font-semibold tracking-tight text-white">{link.name}</span>
                                    </Link>
                                );
                            }

                            const Icon = !isCustomIcon ? (iconMap[link.icon || 'ExternalLink'] || ExternalLink) : null;

                            return (
                                <Link key={link.id} href={link.url} target={link.url.startsWith('mailto') ? undefined : "_blank"} className="link-card flex items-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.07] transition-all">
                                    {isCustomIcon ? (
                                        <img src={link.icon} alt="Icon" className="w-5 h-5 mr-4 object-contain rounded-sm" />
                                    ) : (
                                        <Icon className="w-5 h-5 mr-4 text-zinc-400" />
                                    )}
                                    <span className="text-sm font-semibold tracking-tight text-white">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Music Player */}
                <div className="w-full mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1 block">// Current_Freq</span>
                    <div className="sub-card p-4 rounded-xl flex items-center gap-4 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
                        <img
                            src={config.music.coverUrl}
                            className="w-16 h-16 rounded-lg object-cover shadow-lg border border-white/5"
                            alt="Cover"
                        />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider truncate text-white">{config.music.title}</h4>
                                    <p className="text-[10px] text-zinc-500 font-mono italic">{config.music.artist}</p>
                                </div>
                                <button
                                    onClick={togglePlay}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                                </button>
                            </div>
                            <input
                                type="range"
                                className="w-full h-[3px] bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-white"
                                value={progress}
                                onChange={handleProgressChange}
                                min="0"
                                max="100"
                            />
                            <audio ref={audioRef} src={config.music.audioUrl} />
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                {config.gallery && config.gallery.length > 0 && (
                    <div className="w-full mb-10 animate-fade-in" style={{ animationDelay: '0.45s' }}>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1 block">Visual_Feed</span>
                        <div className="grid grid-cols-2 gap-3">
                            {config.gallery.map((item) => (
                                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900/50">
                                    {item.type === 'video' ? (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            controls={false}
                                            muted
                                            loop
                                            playsInline
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => e.currentTarget.pause()}
                                        />
                                    ) : (
                                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                    )}
                                    {item.caption && (
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[8px] font-mono text-white text-center uppercase tracking-widest truncate">{item.caption}</p>
                                        </div>
                                    )}
                                    {item.type === 'video' && (
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/20 select-none pointer-events-none">
                                            <Play size={6} className="fill-white text-white ml-0.5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resources Cards */}
                <div className="w-full mb-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1 block">Resources_&_Visuals</span>
                    <div className="space-y-3">
                        {config.resources.map(res => {
                            if (res.type === 'gallery') {
                                return (
                                    <Link key={res.id} href={res.url} className="link-card block aspect-[16/5] rounded-xl group relative overflow-hidden bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
                                            style={{ backgroundImage: `url('${config.profile.bannerUrl || "https://objects.avrxt.in/images/aviorxt_01.jpg"}')` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                        <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between z-20">
                                            <div className="flex items-center">
                                                <Camera className="w-5 h-5 mr-4 text-white" />
                                                <span className="text-sm font-semibold tracking-tight text-white uppercase">{res.title}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                );
                            }
                            if (res.type === 'doc') {
                                return (
                                    <Link key={res.id} href={res.url} className="link-card flex items-center justify-between p-4 rounded-xl group bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.07] transition-all">
                                        <div className="flex items-center">
                                            <BookOpen className="w-5 h-5 mr-4 text-zinc-400" />
                                            <span className="text-sm font-semibold tracking-tight text-white underline underline-offset-4 decoration-zinc-800">{res.title}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-zinc-700" />
                                    </Link>
                                );
                            }
                            return (
                                <Link key={res.id} href={res.url} className="link-card block rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden">
                                    <div className="relative h-28 overflow-hidden">
                                        <img src={res.previewUrl}
                                            alt="Post Preview"
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-4">
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/10 backdrop-blur-md text-zinc-300 uppercase tracking-tighter border border-white/5">Latest Post</span>
                                        </div>
                                    </div>
                                    <div className="p-4 pt-0">
                                        <h4 className="text-sm font-bold leading-tight text-white group-hover:text-zinc-300 transition-colors">{res.title}</h4>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[10px] text-zinc-500 font-mono">{res.meta}</span>
                                            <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Newsletter Inline Card */}
                <div className="w-full mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="sub-card p-6 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-3xl">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 block">// Newsletter</span>
                        <h3 className="text-lg font-bold tracking-tight mb-1 text-white">Stay Synchronized</h3>
                        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                            Get Your Special Note&apos;s <span className="inline-block animate-bounce">🍂</span>
                        </p>

                        {subscribeStatus.type && (
                            <p className={cn(
                                "mb-4 text-[10px] font-mono text-center uppercase tracking-widest",
                                "font-bold",
                                subscribeStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                            )}>
                                {subscribeStatus.message}
                            </p>
                        )}

                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 font-mono focus:border-white/40 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:opacity-90 transition-all font-mono disabled:opacity-50"
                                style={{ backgroundColor: config.profile.themeColor || '#ffffff', color: config.profile.themeColor ? (parseInt(config.profile.themeColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff') : '#000' }}
                            >
                                {isSubmitting ? 'CONNECTING...' : 'Subscribe_'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-auto pt-8 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-mono text-[11px] tracking-[0.3em] text-zinc-500 uppercase">All Systems Online</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-700 font-mono uppercase tracking-widest mt-2">
                        <span>&copy; {new Date().getFullYear()} avrxt.in</span>
                        <span className="text-zinc-800">|</span>
                        <Link href="/me/admin" className="text-zinc-800 hover:text-zinc-500 transition-colors">
                            ADMIN
                        </Link>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
                .immersive-mode {
                    transition: all 1s ease;
                }
            `}</style>
        </main>
    );
}
