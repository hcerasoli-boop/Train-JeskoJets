'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, useAnimationFrame, motion } from 'framer-motion';
import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function TrainMorph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastRenderedFrame = useRef<number>(-1);
    const [isReadyToLoad, setIsReadyToLoad] = useState<boolean>(false);

    // Listen for Hero sequence completion to start loading this one
    useEffect(() => {
        const handleSequenceLoaded = () => setIsReadyToLoad(true);
        window.addEventListener('sequence1Loaded', handleSequenceLoaded);
        return () => window.removeEventListener('sequence1Loaded', handleSequenceLoaded);
    }, []);

    // Setup Image Preloader
    const TOTAL_FRAMES = 160;
    const { images, isLoading, progress } = useImagePreloader(
        '/sequence-2/Animation2',
        TOTAL_FRAMES,
        (index) => `frame_${index.toString().padStart(3, '0')}_delay-0.05s.webp`,
        isReadyToLoad
    );

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
            {/* Loading State Overlay */}
            {isLoading && progress > 0 && isReadyToLoad && (
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-[#A3A3A3] z-50">
                    <p className="tracking-[0.2em] text-xs uppercase mb-2">Loading Morph Sequence</p>
                    <div className="w-32 h-[2px] bg-[#1A1A1A]">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Sticky Runway */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
                {/* Top gradient blend */}
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-20" />

                <canvas
                    ref={canvasRef}
                    width={1920}
                    height={1080}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Cinematic Typography Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-20%" }}
                        className="text-white text-4xl md:text-6xl font-light tracking-[0.2em] mb-6"
                    >
                        ENGINEERED FOR TOMORROW.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        viewport={{ once: true, margin: "-20%" }}
                        className="text-[#A3A3A3] text-lg md:text-xl font-light tracking-wide max-w-2xl"
                    >
                        From blueprint to reality. Precision mechanics meet uncompromising luxury.
                    </motion.p>
                </div>

                {/* Soft bottom gradient to blend into Globe section */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
}
