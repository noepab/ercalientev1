import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <path d="M 20,80 Q 50,95 80,80 L 80,50 Q 50,65 20,50 Z" fill="var(--color-primary-dark)" />
            <path d="M 20,55 Q 50,70 80,55 L 80,25 Q 50,40 20,25 Z" fill="var(--color-primary)" />
            <path d="M 50,15 A 30 10 0 0 0 50 35 A 30 10 0 0 0 50 15 Z" fill="var(--color-text-light)" transform="rotate(15 50 25)" />
        </g>
    </svg>
);