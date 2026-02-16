'use client';

import { useState } from 'react';
import { login } from '@/app/actions/auth';
import { BookOpen } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AUTHENTICATING...
                </>
            ) : (
                'INITIALIZE_SESSION'
            )}
        </button>
    );
}

export default function LoginPage() {
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-mono">
            <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h1 className="text-xl font-bold tracking-[0.2em] uppercase mb-2">avrxt_Admin_Gateway</h1>
                    <p className="text-[10px] text-zinc-500 tracking-widest uppercase">System_Wide_Access</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all text-white"
                            placeholder="admin@avrxt.in"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-[10px] text-red-500 text-center uppercase tracking-tighter">
                            ERROR: {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </main>
    );
}
