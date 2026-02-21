'use client';

export default function Globe() {
    return (
        <div className="relative h-screen w-full bg-[#050505] overflow-hidden">
            {/* Soft top gradient to blend from TrainMorph section */}
            <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-20" />

            {/* Background Video */}
            <video
                src="/EARTHROTATION(2).mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Cinematic Typography Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                <h2 className="text-white text-4xl md:text-6xl font-light tracking-[0.2em] mb-6">
                    A WORLD CONNECTED.
                </h2>
                <p className="text-[#A3A3A3] text-lg md:text-xl font-light tracking-wide max-w-2xl">
                    Bridging continents with next-generation rail architecture.
                </p>
            </div>
        </div>
    );
}
