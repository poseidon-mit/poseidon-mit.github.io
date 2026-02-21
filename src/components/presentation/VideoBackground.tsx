import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function VideoBackground({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log('Autoplay prevented', e));
            });
            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log('Autoplay prevented', e));
            });
            return () => {
                video.pause();
                video.removeAttribute('src');
                video.load();
            };
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
        />
    );
}
