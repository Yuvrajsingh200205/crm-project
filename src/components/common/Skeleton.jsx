import React from 'react';

export default function Skeleton({ className = '', variant = 'text', count = 1 }) {
    const baseClass = "animate-pulse bg-slate-200 rounded";
    
    const variants = {
        text: "h-3 w-full mb-2",
        title: "h-6 w-1/2 mb-4",
        circle: "h-10 w-10 rounded-full",
        badge: "h-5 w-16 rounded-full",
        button: "h-10 w-24 rounded-lg",
        card: "h-32 w-full",
        tableRow: "h-12 w-full border-b border-slate-100"
    };

    const items = Array.from({ length: count });

    return (
        <>
            {items.map((_, i) => (
                <div key={i} className={`${baseClass} ${variants[variant] || ''} ${className}`} />
            ))}
        </>
    );
}
