'use client';

import { useRef, useEffect } from 'react';
import { useScroll, useTransform, useAnimationFrame, motion } from 'framer-motion';
import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastRenderedFrame = useRef<number>(-1);

    // Setup Image Preloader
    const TOTAL_FRAMES = 160;
    const { images, isLoading, progress } = useImagePreloader(
        '/sequence-1/HEROANIMATION(jpg)',
        TOTAL_FRAMES,
        (index) => `frame_${index.toString().padStart(3, '0')}_delay-0.05s.webp`,
        true // Always load the first sequence
    );

    // Trigger next sequence to start loading once sequence 1 finishes
    useEffect(() => {
        if (!isLoading && progress === 100) {
            window.dispatchEvent(new Event('sequence1Loaded'));
        }
    }, [isLoading, progress]);

    // Framer Motion Scroll Mapping
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Canvas Drawing Logic
    useAnimationFrame(() => {
        if (!canvasRef.current || images.length === 0 || isLoading) return;

        const currentFrame = Math.round(frameIndex.get());

        // Performance Fix: Only redraw if the frame actually changed
        if (currentFrame === lastRenderedFrame.current) return;

        const context = canvasRef.current.getContext('2d', { alpha: false }); // alpha: false helps performance
        if (!context) return;

        if (images[currentFrame]) {
            const img = images[currentFrame];
            const canvas = canvasRef.current;

            const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * ratio) / 2;
            const y = (canvas.height - img.height * ratio) / 2;

            context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);

            lastRenderedFrame.current = currentFrame;
        }
    });

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-[#FFFFFF]">
                    <p className="tracking-[0.2em] text-sm md:text-base uppercase mb-4">Initializing Sequence</p>
                    <div className="w-48 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#FFFFFF] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Sticky Runway */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={1920}
                    height={1080}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Cinematic Typography Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-white text-5xl md:text-7xl font-light tracking-[0.2em] mb-6"
                    >
                        ELEVATE THE JOURNEY.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="text-[#A3A3A3] text-lg md:text-2xl font-light tracking-wide max-w-2xl"
                    >
                        Experience the Alpine horizon in unparalleled silence and speed.
                    </motion.p>
                </div>

                {/* Soft bottom gradient to blend into next section */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
}
