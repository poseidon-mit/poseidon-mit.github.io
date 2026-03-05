import React from 'react';
import { theme } from '../theme';

interface IconTridentProps {
    /** Rendered pixel size (width = height). Default 400. */
    size?: number;
    /** Primary accent color for the center prong and outline. */
    color?: string;
    /** Kept for API compatibility. Clean icon ignores glow requests. */
    neon?: boolean;
    /** Additional CSS on the root element. */
    style?: React.CSSProperties;
}

const CENTER_PRONG = 'M191 50L200 36L209 50L212 172H188Z';
const LEFT_PRONG = 'M107 78L116 64L125 78L128 172H104Z';
const RIGHT_PRONG = 'M275 78L284 64L293 78L296 172H272Z';
const CROSS_GUARD = 'M96 172C96 166 102 162 108 162H292C298 162 304 166 304 172V192C304 198 298 202 292 202H108C102 202 96 198 96 192Z';
const SHAFT = 'M188 198H212V346C212 352 206 358 200 358C194 358 188 352 188 346Z';

const outlineStyle = {
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

/**
 * Poseidon trident rendered as a clean vector icon.
 * No glow, blur, shadow, or backdrop effects are applied here.
 */
export const IconTrident: React.FC<IconTridentProps> = ({
    size = 400,
    color = theme.accent.cyan,
    neon: _neon = false,
    style,
}) => {
    const uid = React.useId().replace(/:/g, '');
    const centerFillId = `trident-center-${uid}`;
    const leftFillId = `trident-left-${uid}`;
    const rightFillId = `trident-right-${uid}`;
    const bodyFillId = `trident-body-${uid}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Poseidon.AI Trident"
            style={{
                display: 'block',
                ...style,
            }}
        >
            <defs>
                <linearGradient id={centerFillId} x1="200" y1="36" x2="200" y2="358" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#E6FCFF" />
                    <stop offset="0.38" stopColor="#8BEAF3" />
                    <stop offset="1" stopColor={color} />
                </linearGradient>
                <linearGradient id={leftFillId} x1="116" y1="64" x2="116" y2="172" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#DDFBF6" />
                    <stop offset="1" stopColor={theme.accent.teal} />
                </linearGradient>
                <linearGradient id={rightFillId} x1="284" y1="64" x2="284" y2="172" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#EFE7FF" />
                    <stop offset="1" stopColor={theme.accent.violet} />
                </linearGradient>
                <linearGradient id={bodyFillId} x1="96" y1="162" x2="240" y2="346" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#C7FAFF" />
                    <stop offset="0.55" stopColor="#88E4EF" />
                    <stop offset="1" stopColor={color} />
                </linearGradient>
            </defs>

            <path d={LEFT_PRONG} fill={`url(#${leftFillId})`} />
            <path d={RIGHT_PRONG} fill={`url(#${rightFillId})`} />
            <path d={CENTER_PRONG} fill={`url(#${centerFillId})`} />
            <path d={CROSS_GUARD} fill={`url(#${bodyFillId})`} />
            <path d={SHAFT} fill={`url(#${bodyFillId})`} />

            <path d={LEFT_PRONG} stroke="#118C82" strokeWidth="2" {...outlineStyle} />
            <path d={RIGHT_PRONG} stroke="#8367E8" strokeWidth="2" {...outlineStyle} />
            <path d={CENTER_PRONG} stroke={color} strokeWidth="2" {...outlineStyle} />
            <path d={CROSS_GUARD} stroke={color} strokeWidth="2" {...outlineStyle} />
            <path d={SHAFT} stroke={color} strokeWidth="2" {...outlineStyle} />
        </svg>
    );
};
