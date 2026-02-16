'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Github, Send, Trash2, Edit3, X, Check } from 'lucide-react';
import { signInWithGithub, postMessage, deleteMessage, updateMessage } from '@/app/actions/guestbook';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    message: string;
    created_at: string;
}

export default function GuestbookClient({ user, initialMessages }: { user: User | null, initialMessages: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editInput, setEditInput] = useState('');

    const handleSignIn = async () => {
        const { url, error } = await signInWithGithub();
        if (error) alert(error);
        else if (url) window.location.href = url;
    };

    const handleSignOut = async () => {
        const { logout } = await import('@/app/actions/auth');
        await logout();
        window.location.reload();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        setIsSubmitting(true);
        // Better fallback for names and avatars
        const name = user.user_metadata.full_name || user.user_metadata.user_name || user.email?.split('@')[0] || 'Anonymous';
        const avatar = user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

        const result = await postMessage(input, name, avatar);
        if (result.error) {
            alert(result.error);
        } else {
            setInput('');
            window.location.reload();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        const result = await deleteMessage(id);
        if (result.error) alert(result.error);
        else window.location.reload();
    };

    const handleUpdate = async (id: string) => {
        if (!editInput.trim()) return;
        const result = await updateMessage(id, editInput);
        if (result.error) alert(result.error);
        else {
            setEditingId(null);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-12">
            {/* Auth/Post Section */}
            {!user ? (
                <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md text-center">
                    <p className="text-zinc-400 mb-6 font-mono text-xs uppercase tracking-widest">Sign in to leave a message</p>
                    <button
                        onClick={handleSignIn}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        <Github size={18} />
                        Continue with GitHub
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <img
                                src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                                className="w-5 h-5 rounded-full border border-white/10"
                            />
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                Posting as <span className="text-zinc-300">{user.user_metadata.full_name || user.email}</span>
                            </span>
                        </div>
                        <button onClick={handleSignOut} className="text-[9px] font-mono text-zinc-600 hover:text-white uppercase transition-colors">
                            [ Sign_Out ]
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-1 gap-2 flex flex-col sm:flex-row items-stretch">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-white/20 transition-all font-mono text-sm"
                            maxLength={200}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !input.trim()}
                            className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                        >
                            {isSubmitting ? '...' : <><Send size={16} /> Post</>}
                        </button>
                    </form>
                </div>
            )}

            {/* Messages List */}
            <div className="space-y-6">
                {messages.length === 0 ? (
                    <p className="text-center text-zinc-600 font-mono text-xs py-10 tracking-[0.3em] uppercase">No messages yet. Be the first!</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="group p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-start gap-4">
                                <img src={msg.user_avatar} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold font-mono text-white truncate">{msg.user_name}</h4>
                                        <span className="text-[10px] text-zinc-600 font-mono">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {editingId === msg.id ? (
                                        <div className="space-y-2 mt-2">
                                            <textarea
                                                value={editInput}
                                                onChange={(e) => setEditInput(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-white/30"
                                                rows={2}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdate(msg.id)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors">
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-zinc-400 text-sm leading-relaxed">{msg.message}</p>
                                    )}

                                    {/* Actions for owner */}
                                    {user?.id === msg.user_id && editingId !== msg.id && (
                                        <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingId(msg.id);
                                                    setEditInput(msg.message);
                                                }}
                                                className="text-[10px] font-mono uppercase text-zinc-500 hover:text-white flex items-center gap-1"
                                            >
                                                <Edit3 size={10} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-[10px] font-mono uppercase text-zinc-500 hover:text-red-500 flex items-center gap-1"
                                            >
                                                <Trash2 size={10} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
