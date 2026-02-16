'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}

export default function Reveal({ children, className, id, style }: RevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isOut, setIsOut] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        setIsOut(false);
                    } else {
                        if (entry.boundingClientRect.top > 0) {
                            setIsVisible(false);
                            setIsOut(true);
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            id={id}
            ref={ref}
            style={style}
            className={cn("reveal", isVisible && "active", isOut && "out", className)}
        >
            {children}
        </div>
    );
}
