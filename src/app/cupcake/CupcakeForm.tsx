'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { createTipOrder, verifyTipAndSave } from '@/app/actions/cupcake';
import { Loader2, Heart, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/Reveal';

const PRESETS = [
    { label: '🧁 Cupcake', amount: 99, icon: '🧁' },
    { label: '🍩 Donut', amount: 199, icon: '🍩' },
    { label: '🍰 Cake', amount: 499, icon: '🍰' },
];

export default function CupcakeForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(99);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const finalAmount = selectedAmount !== null ? selectedAmount : parseInt(customAmount) || 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (finalAmount < 1) {
            setStatus({ type: 'error', message: 'Amount must be at least ₹1' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        const formData = new FormData(e.currentTarget);
        const userName = formData.get('name') as string;
        const userEmail = formData.get('email') as string;
        const note = formData.get('note') as string;

        try {
            const orderResult = await createTipOrder(finalAmount);
            if (!orderResult.success || !orderResult.order) throw new Error(orderResult.error || 'Gateway error');

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderResult.order.amount,
                currency: orderResult.order.currency,
                name: "avrxt 🧁",
                description: "Fueling Innovation",
                order_id: orderResult.order.id,
                handler: async (response: any) => {
                    try {
                        const verifyResult = await verifyTipAndSave(
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            { userName, userEmail, amount: finalAmount, note }
                        );

                        if (verifyResult.success) {
                            setStatus({ type: 'success', message: 'Thank you for the support! 🖤' });
                            setTimeout(() => router.refresh(), 2000);
                        } else throw new Error(verifyResult.error);
                    } catch (err: any) {
                        setStatus({ type: 'error', message: err.message });
                        setIsSubmitting(false);
                    }
                },
                prefill: { name: userName, email: userEmail },
                theme: { color: "#ff4785" },
                modal: { ondismiss: () => setIsSubmitting(false) }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
            setIsSubmitting(false);
        }
    };

    return (
        <Reveal className="w-full">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Select Amount */}
                <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block text-center">Fuel_Level_Selection</label>
                    <div className="grid grid-cols-3 gap-3">
                        {PRESETS.map((p) => (
                            <button
                                key={p.amount}
                                type="button"
                                onClick={() => { setSelectedAmount(p.amount); setCustomAmount(''); }}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group",
                                    selectedAmount === p.amount
                                        ? "bg-white text-black border-white scale-[1.05]"
                                        : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/10"
                                )}
                            >
                                <span className="text-2xl">{p.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter">₹{p.amount}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Or Enter Custom Amount"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-center text-sm text-white focus:border-white/20 outline-none transition-all font-mono"
                        />
                        <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            name="name"
                            required
                            placeholder="Your Name"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-white/10 transition-all font-mono"
                        />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Your Email"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-white/10 transition-all font-mono"
                        />
                    </div>
                    <textarea
                        name="note"
                        placeholder="Attach a sweet note (Optional)"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-white/10 transition-all font-mono h-24 resize-none"
                    />
                </div>

                {status.message && (
                    <div className={cn(
                        "p-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-center",
                        status.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            SEND Cupcake (₹{finalAmount})
                            <Heart className="w-4 h-4 fill-black" />
                        </>
                    )}
                </button>

                <p className="mt-8 text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed text-center">
                    By proceeding, you agree to our <Link href="/terms" className="text-zinc-500 hover:text-white underline underline-offset-4">Terms</Link> and <Link href="/refund" className="text-zinc-500 hover:text-white underline underline-offset-4">Refund Policy</Link>. <br />
                    All digital contributions are non-refundable. Secure 256-bit SSL encrypted transmission.
                </p>
            </form>
        </Reveal>
    );
}
