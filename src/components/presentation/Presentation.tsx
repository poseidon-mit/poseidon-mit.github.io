import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface PresentationProps {
    slides: React.ReactNode[];
}

export function Presentation({ slides }: PresentationProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    // Use a ref to track if we're currently animating to prevent rapid scrolling
    const isAnimating = useRef(false);

    // Track touch interactions for mobile swiping
    const touchStart = useRef<{ x: number, y: number } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide, slides.length]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
                nextSlide();
            } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
                prevSlide();
            } else if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                toggleFullscreen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, toggleFullscreen]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isAnimating.current) return;

            // Determine scroll direction (positive is down, negative is up)
            // Use a threshold to ignore tiny trackpad movements
            if (Math.abs(e.deltaY) < 30) return;

            if (e.deltaY > 0) {
                if (currentSlide < slides.length - 1) {
                    isAnimating.current = true;
                    nextSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800); // Wait for transition
                }
            } else if (e.deltaY < 0) {
                if (currentSlide > 0) {
                    isAnimating.current = true;
                    prevSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800); // Wait for transition
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current || isAnimating.current) return;

            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };

            const deltaY = touchStart.current.y - touchEnd.y;
            const deltaX = touchStart.current.x - touchEnd.x;

            // Prioritize vertical swipe, but allow horizontal as fallback if it's larger
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                // Vertical Swipe
                if (deltaY > 0 && currentSlide < slides.length - 1) { // Swipe up -> next slide
                    isAnimating.current = true;
                    nextSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800);
                } else if (deltaY < 0 && currentSlide > 0) { // Swipe down -> prev slide
                    isAnimating.current = true;
                    prevSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800);
                }
            } else if (Math.abs(deltaX) > 50) {
                // Horizontal Swipe
                if (deltaX > 0 && currentSlide < slides.length - 1) { // Swipe left -> next slide
                    isAnimating.current = true;
                    nextSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800);
                } else if (deltaX < 0 && currentSlide > 0) { // Swipe right -> prev slide
                    isAnimating.current = true;
                    prevSlide();
                    setTimeout(() => { isAnimating.current = false; }, 800);
                }
            }
            touchStart.current = null;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: true });
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [currentSlide, nextSlide, prevSlide, slides.length]);

    const variants = {
        enter: (dir: number) => ({
            opacity: 0,
            y: dir > 0 ? '50%' : '-50%',
        }),
        center: {
            opacity: 1,
            y: 0,
        },
        exit: (dir: number) => ({
            opacity: 0,
            y: dir > 0 ? '-50%' : '50%',
        }),
    };


    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen bg-black overflow-hidden font-display text-white"
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full"
                >
                    {slides[currentSlide]}
                </motion.div>
            </AnimatePresence>

        </div>
    );
}
