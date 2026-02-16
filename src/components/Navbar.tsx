'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Hide navbar on /me routes
    if (pathname.startsWith('/me')) {
        return null;
    }

    const navLinks = [
        { name: '/about', href: '/#about' },
        { name: '/skills', href: '/#expertise' },
        { name: '/projects', href: '/#projects' },
        { name: '/cloud', href: '/cloud' },
        { name: '/cupcake', href: '/cupcake' },
        { name: '/biz', href: '/#solutions' },
    ];

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <nav className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link href="/" className="transition-opacity hover:opacity-70">
                    <img src="https://cdn.avrxt.in/assets/logo.png" alt="avrxt" className="h-10 md:h-12 w-auto" />
                </Link>

                <div className="hidden sm:flex items-center space-x-8 text-[12px] font-medium tracking-tighter text-zinc-400">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/contact" className="bg-white text-black px-4 py-1.5 rounded-full hover:scale-105 transition-transform font-bold">
                        Contact
                    </Link>
                </div>

                <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            <div className={cn(
                "sm:hidden bg-black border-b border-white/5 px-6 space-y-4 overflow-hidden transition-all duration-400",
                isOpen ? "max-h-[400px] py-6 opacity-100" : "max-h-0 py-0 opacity-0"
            )}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="block text-zinc-400 py-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
                <Link href="/contact" className="block bg-white text-black text-center py-3 rounded-lg font-bold" onClick={() => setIsOpen(false)}>
                    Contact
                </Link>
            </div>
        </header>
    );
}
