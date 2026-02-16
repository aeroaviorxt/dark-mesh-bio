import Link from 'next/link';
import { Cloud, Zap, Globe, Smartphone, Code2, Bot, Layers, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SpotlightBox from '@/components/SpotlightBox';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Premium Cloud Engineering & Solutions | avrxt',
    description: 'Scalable, high-performance services including Web Development, Discord Bot Architecture, API Design, and N8N Automation. Secure and enterprise-ready.',
    keywords: ['cloud engineering', 'web development', 'discord bot development', 'n8n automation', 'rest api design', 'website maintenance'],
};

export const SERVICES = [
    {
        id: 'web-dev',
        title: 'Web Development',
        iconName: 'Globe',
        description: 'Building modern, high-speed digital presences tailored for performance.',
        variants: [
            { id: 'static', name: 'Static Website', price: 5999, features: ['3-5 Pages', 'Basic SEO', 'Responsive', '7 Days Support'] },
            { id: 'fullstack', name: 'Full Stack Website', price: 24999, features: ['Custom Auth', 'Database', 'API Logic', 'Deployment Help'] }
        ]
    },
    {
        id: 'bot-dev',
        title: 'Discord Bot Development',
        iconName: 'Bot',
        description: 'Custom automation for your community. From basic moderation to complex dashboards.',
        variants: [
            { id: 'normal', name: 'Normal Bot', price: 3999, features: ['Moderation', 'Commands', 'Logging'] },
            { id: 'advanced', name: 'Advanced Bot', price: 9999, features: ['Web Dashboard', 'DB Integration', 'API Connect'] },
            { id: 'custom', name: 'Custom Architecture', price: 0, features: ['Complex Logic', 'Neural Integrations', 'Price on Request'] }
        ]
    },
    {
        id: 'api-dev',
        title: 'API Development',
        iconName: 'Zap',
        description: 'Secure, scalable RESTful backend systems for your apps.',
        variants: [
            { id: 'standard', name: 'REST API', price: 6999, features: ['Authentication', 'CRUD Operations', 'Documentation', 'Scale Ready'] }
        ]
    },
    {
        id: 'n8n-auto',
        title: 'N8N Automation',
        iconName: 'Cloud',
        description: 'Streamline your workflows with powerful low-code automation.',
        variants: [
            { id: 'standard', name: 'Workflow Logic', price: 4999, features: ['Webhook Integration', 'Workflow Design', 'Testing', 'Handover'] }
        ]
    },
    {
        id: 'redesign',
        title: 'Website Re-Design',
        iconName: 'Layers',
        description: 'Give your existing platform a professional UI/UX makeover.',
        variants: [
            { id: 'basic', name: 'Basic UI Refresh', price: 4999, features: ['Color/Font Sync', 'Mobile Fix', 'Minor Layout Changes'] },
            { id: 'advanced', name: 'Advanced Overhaul', price: 9999, features: ['Animation Sync', 'Performance Fix', 'SEO Re-structure'] },
            { id: 'full', name: 'Full Re-Design', price: 0, features: ['Structural Rebuild', 'New Tech Stack', 'Price on Request'] }
        ]
    },
    {
        id: 'maintenance',
        title: 'Website Maintenance',
        iconName: 'ShieldCheck',
        description: 'Keep your systems running 24/7 with professional upkeep.',
        variants: [
            { id: 'basic', name: 'Basic Care', price: 4999, features: ['Uptime Monitoring', 'Minor Bug Fixes', 'Content Updates', 'Monthly Backup'] },
            { id: 'pro', name: 'Enterprise Management', price: 12999, features: ['Security Hardening', 'Weekly Backup', 'Priority Support', 'API Monitoring'] }
        ]
    }
];

const iconMap: Record<string, any> = {
    Globe, Layers, Bot, Code2, Zap, Cloud, ShieldCheck
};

export default function CloudPage() {
    return (
        <main className="max-w-6xl mx-auto px-6 py-32">
            <Reveal className="text-center mb-20 pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-6">
                    <Cloud className="w-3 h-3" /> System_Cloud_Layer
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 gradient-heading">
                    Premium Engineering <br />& Cloud Solutions.
                </h1>
                <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
                    Scalable, high-performance services tailored for modern digital needs.
                    From static footprints to complex neural bot architectures.
                </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service, idx) => {
                    const Icon = iconMap[service.iconName] || Globe;
                    return (
                        <Reveal key={service.id} style={{ transitionDelay: `${idx * 0.1}s` }}>
                            <Link href={`/cloud/${service.id}`} className="block group h-full">
                                <SpotlightBox className="h-full">
                                    <div className="p-8 flex flex-col h-full">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                                            <Icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                                        <div className="text-2xl font-black text-white mb-4">
                                            {service.variants[0].price > 0 ? `₹${service.variants[0].price.toLocaleString()}` : "Contact"}
                                            <span className="text-xs font-mono text-zinc-600"> {service.variants.length > 1 ? 'STARTING' : ''}</span>
                                        </div>

                                        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <ul className="space-y-3 mb-8 flex-grow">
                                            {service.variants[0].features.slice(0, 4).map((f: string) => (
                                                <li key={f} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                                                    <CheckCircle2 className="w-3 h-3 text-zinc-800" /> {f}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/5 group-hover:gap-4 transition-all">
                                            Select Service <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </SpotlightBox>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>

            <Reveal className="mt-32 p-12 rounded-3xl border border-white/5 bg-white/[0.02] text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Custom Requirements?</h2>
                <p className="text-zinc-500 mb-8 max-w-xl mx-auto">
                    Need something specifically tailored for your business? Let's discuss your custom architecture and design.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                    Talk to Engineer
                </Link>
            </Reveal>
        </main>
    );
}
