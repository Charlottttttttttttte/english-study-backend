import { motion } from 'framer-motion';

interface GardenPlantProps {
  level: number;
}

function SproutStage() {
  return (
    <svg viewBox="0 0 80 120" className="w-full h-full">
      <path d="M40 120 Q40 80 35 60" stroke="#4A8B6F" strokeWidth="3" fill="none" />
      <ellipse cx="28" cy="55" rx="12" ry="8" fill="#4A8B6F" transform="rotate(-20 28 55)" />
      <ellipse cx="52" cy="65" rx="10" ry="7" fill="#7BC4A8" transform="rotate(15 52 65)" />
      <ellipse cx="30" cy="40" rx="9" ry="6" fill="#2D5A4A" transform="rotate(-10 30 40)" />
    </svg>
  );
}

function SmallTreeStage() {
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full">
      <path d="M50 140 Q50 100 48 70" stroke="#2D5A4A" strokeWidth="3" fill="none" />
      <path d="M48 100 Q20 85 15 70 Q30 80 48 90" fill="#7BC4A8" />
      <path d="M48 80 Q75 65 82 50 Q68 60 48 72" fill="#4A8B6F" />
      <path d="M48 60 Q25 45 22 30 Q35 42 48 52" fill="#7BC4A8" />
    </svg>
  );
}

function BigTreeStage() {
  return (
    <svg viewBox="0 0 120 180" className="w-full h-full">
      <path d="M60 180 Q60 130 58 90" stroke="#2D5A4A" strokeWidth="4" fill="none" />
      <ellipse cx="45" cy="80" rx="18" ry="12" fill="#4A8B6F" transform="rotate(-25 45 80)" />
      <ellipse cx="78" cy="95" rx="16" ry="10" fill="#2D5A4A" transform="rotate(20 78 95)" />
      <ellipse cx="42" cy="55" rx="15" ry="10" fill="#C4956A" transform="rotate(-15 42 55)" opacity="0.8" />
      <ellipse cx="75" cy="65" rx="14" ry="9" fill="#4A8B6F" transform="rotate(25 75 65)" />
      <circle cx="55" cy="45" r="6" fill="#8B6239" opacity="0.6" />
    </svg>
  );
}

function FloweringStage() {
  return (
    <svg viewBox="0 0 100 130" className="w-full h-full">
      <path d="M50 130 Q50 90 50 60" stroke="#4A8B6F" strokeWidth="3" fill="none" />
      <path d="M50 80 Q25 65 20 45 Q35 58 50 70" fill="#FFD166" opacity="0.9" />
      <path d="M50 70 Q72 55 78 38 Q65 50 50 62" fill="#C06C4A" opacity="0.85" />
      <circle cx="50" cy="38" r="14" fill="#FFD166" />
      <circle cx="45" cy="34" r="4" fill="#C06C4A" opacity="0.5" />
      <circle cx="55" cy="40" r="3" fill="#C06C4A" opacity="0.4" />
    </svg>
  );
}

export default function GardenPlant({ level }: GardenPlantProps) {
  const getStage = () => {
    if (level <= 6) return <SproutStage />;
    if (level <= 14) return <SmallTreeStage />;
    if (level <= 22) return <BigTreeStage />;
    return <FloweringStage />;
  };

  const getSize = () => {
    if (level <= 6) return 'w-20 h-28';
    if (level <= 14) return 'w-28 h-36';
    if (level <= 22) return 'w-32 h-44';
    return 'w-36 h-48';
  };

  const getLabel = () => {
    if (level <= 6) return '小芽阶段';
    if (level <= 14) return '小树阶段';
    if (level <= 22) return '大树阶段';
    return '开花阶段';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`${getSize()}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        key={level}
      >
        {getStage()}
      </motion.div>
      <span className="text-xs text-white/80 font-body">{getLabel()}</span>
    </div>
  );
}
