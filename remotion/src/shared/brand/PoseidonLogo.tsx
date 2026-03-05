
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';

interface PoseidonLogoProps {
    size?: number;
    color?: string; // Kept for API compatibility, but PNG is fixed color
    animated?: boolean;
    style?: React.CSSProperties;
}

export const PoseidonLogo: React.FC<PoseidonLogoProps> = ({
    size = 100,
    animated = false,
    style,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = animated
        ? interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp' })
        : 1;

    const opacity = interpolate(progress, [0, 0.5], [0, 1]);
    const scale = interpolate(progress, [0, 1], [0.8, 1]);

    return (
        <div style={{ ...style, width: size, height: size, position: 'relative', opacity, transform: `scale(${scale})` }}>
            <Img
                src={staticFile("assets/png/logo-webui.png")}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};
