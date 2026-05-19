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

        {/* Hidden Animals - 随机大小，更自然 */}

        {/* Tiger - 最大，右上角 */}
        <div className="absolute top-[12%] right-[8%] w-[90px] h-[90px] opacity-[0.30] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-tiger.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Monkey - 中等偏大，左中 */}
        <div className="absolute top-[38%] left-[5%] w-[75px] h-[75px] opacity-[0.30] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-monkey.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Frog - 最小，左下 */}
        <div className="absolute bottom-[20%] left-[15%] w-[45px] h-[45px] opacity-[0.30] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-frog.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Parrot - 中等，右中 */}
        <div className="absolute top-[60%] right-[10%] w-[65px] h-[65px] opacity-[0.30] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-parrot.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Snake - 细长，左上（新图片） */}
        <div className="absolute top-[5%] left-[20%] w-[80px] h-[55px] opacity-[0.28] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-snake.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Butterfly - 很小，中右（新图片） */}
        <div className="absolute top-[45%] right-[20%] w-[40px] h-[40px] opacity-[0.28] hover:opacity-100 transition-all duration-500 cursor-pointer hover:scale-125 z-[5]">
          <img src="./hidden-butterfly.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[6]"
          style={{ background: 'rgba(10, 22, 16, 0.45)' }}
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
