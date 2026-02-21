import HeroScroll from '@/components/HeroScroll';
import TrainMorph from '@/components/TrainMorph';
import Globe from '@/components/Globe';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white selection:text-black">
      <HeroScroll />
      <TrainMorph />
      <Globe />
    </main>
  );
}
