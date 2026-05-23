      {/* === 漂浮的小动物（更大，融入背景） === */}
      {[
        { src: './hidden-butterfly.png', x: '8%', y: '18%', size: 56, delay: 0 },
        { src: './hidden-frog.png', x: '82%', y: '72%', size: 64, delay: 1.5 },
        { src: './hidden-monkey.png', x: '72%', y: '15%', size: 72, delay: 0.8 },
        { src: './hidden-parrot.png', x: '5%', y: '58%', size: 60, delay: 2.2 },
        { src: './hidden-tiger.png', x: '85%', y: '42%', size: 76, delay: 1.2 },
      ].map((animal, i) => (
        <motion.img
          key={i}
          src={animal.src}
          alt=""
          className="fixed z-0 pointer-events-none"
          style={{
            left: animal.x,
            top: animal.y,
            width: animal.size,
            height: animal.size,
            opacity: 0.45,
            filter: 'brightness(0.7) contrast(1.1) sepia(0.3) saturate(0.8) drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
            mixBlendMode: 'soft-light',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.45, 0.45, 0],
            scale: [0.5, 1, 1, 0.8],
            y: [0, -10, 10, 0],
          }}
          transition={{
            duration: 10,
            delay: animal.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
