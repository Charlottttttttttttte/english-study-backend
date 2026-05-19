import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen relative">
      {/* Fixed Jungle Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Layer 1 - Deepest background */}
        <div
          className="absolute inset-0 animate-foliage-rustle"
          style={{
            backgroundImage: 'url(./jungle-bg-layer-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.60,
          }}
        />
        {/* Layer 2 - Mid foliage */}
        <div
          className="absolute inset-0 animate-foliage-rustle"
          style={{
            backgroundImage: 'url(./jungle-bg-layer-2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animationDirection: 'reverse',
            animationDelay: '-2s',
            opacity: 0.40,
          }}
        />
        {/* Layer 3 - Foreground foliage */}
        <div
          className="absolute inset-0 animate-foliage-rustle"
          style={{
            backgroundImage: 'url(./jungle-bg-layer-3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animationDelay: '-4s',
            opacity: 0.25,
          }}
        />

        {/* Hidden Tiger - top right area */}
        <div
          className="absolute top-[15%] right-[5%] w-[120px] h-[120px] opacity-[0.08] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-tiger.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Hidden Monkey - left middle */}
        <div
          className="absolute top-[35%] left-[3%] w-[100px] h-[100px] opacity-[0.08] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-monkey.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Hidden Frog - bottom left */}
        <div
          className="absolute bottom-[25%] left-[8%] w-[60px] h-[60px] opacity-[0.08] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-frog.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Hidden Parrot - right side */}
        <div
          className="absolute top-[55%] right-[5%] w-[80px] h-[80px] opacity-[0.08] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-parrot.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Hidden Snake - top left, on a branch 🆕 */}
        <div
          className="absolute top-[8%] left-[12%] w-[70px] h-[70px] opacity-[0.06] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-snake.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Hidden Butterfly - floating near center-right 🆕 */}
        <div
          className="absolute top-[40%] right-[15%] w-[50px] h-[50px] opacity-[0.07] hover:opacity-50 transition-all duration-500 cursor-pointer hover:scale-105 z-[5]"
          style={{ filter: 'blur(1px)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.filter = 'blur(0px)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.filter = 'blur(1px)'; }}
        >
          <img src="./hidden-butterfly.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* STRONG Dark overlay - keeps background subtle */}
        <div
          className="absolute inset-0 pointer-events-none z-[6]"
          style={{
            background: 'rgba(10, 22, 16, 0.45)',
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[7]"
          style={{
            backgroundImage: 'url(./noise-texture.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            mixBlendMode: 'overlay',
            opacity: 0.04,
          }}
        />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-2/3 mx-auto pb-24 min-w-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
