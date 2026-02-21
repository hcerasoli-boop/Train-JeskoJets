'use client';

import { useRef } from 'react';
import { useScroll, useTransform, useAnimationFrame } from 'framer-motion';
import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Setup Image Preloader
    const TOTAL_FRAMES = 160;
    const { images, isLoading, progress } = useImagePreloader(
        '/sequence-1/HEROANIMATION(jpg)',
        TOTAL_FRAMES,
        (index) => `frame_${index.toString().padStart(3, '0')}_delay-0.05s.jpg`
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

        const context = canvasRef.current.getContext('2d');
        if (!context) return;

        // Get current frame index from transform motion
        const currentFrame = Math.round(frameIndex.get());

        // Safety check just in case index goes out of bounds
        if (images[currentFrame]) {
            const img = images[currentFrame];

            // Clear and draw image stretching to cover canvas (mimic object-fit: cover)
            const canvas = canvasRef.current;
            const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * ratio) / 2;
            const y = (canvas.height - img.height * ratio) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
        }
    });

    // Keep internal resolution synced for retina displays
    // Example uses 1920x1080 logic for 16:9 images; this could be dynamic
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
                    <h1 className="text-white text-5xl md:text-7xl font-light tracking-[0.2em] mb-6">
                        ELEVATE THE JOURNEY.
                    </h1>
                    <p className="text-[#A3A3A3] text-lg md:text-2xl font-light tracking-wide max-w-2xl">
                        Experience the Alpine horizon in unparalleled silence and speed.
                    </p>
                </div>

                {/* Soft bottom gradient to blend into next section */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
}
