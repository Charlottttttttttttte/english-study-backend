import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Flame, Clock, Target, Mic } from 'lucide-react';
import ConfettiCelebration from '../components/ConfettiCelebration';
import GardenPlant from '../components/GardenPlant';
import { loadDayProgress, loadUserState } from '../data/storage';

interface AnimatedNumberProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function AnimatedNumber({ target, duration = 1500, suffix = '', prefix = '', decimals = 0 }: AnimatedNumberProps) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return (
    <span>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value)}{suffix}
    </span>
  );
}

export default function StatsPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const progress = date ? loadDayProgress(date) : null;
  const user = loadUserState();
  const [confettiDone, setConfettiDone] = useState(false);

  const duration = progress?.studyDuration ?? 0;
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  const formatTime = () => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-8 pb-8">
      <ConfettiCelebration trigger={!confettiDone} onComplete={() => setConfettiDone(true)} />

      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <motion.div
          className="text-5xl mb-3"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h1 className="font-display text-3xl text-cacao-cream text-shadow-glow mb-2">
          恭喜完成今日学习！
        </h1>
        <p className="font-body text-white/80 text-sm">{date}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Study Duration */}
        <motion.div
          className="glass-card p-4 rounded-jumbo flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Clock size={20} className="text-cacao-gold mb-2" />
          <span className="font-display text-2xl text-white">
            {formatTime()}
          </span>
          <span className="text-xs text-white/70 font-body mt-1">学习时长</span>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="glass-card p-4 rounded-jumbo flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Flame size={20} className="text-sun-glow mb-2" />
          <span className="font-display text-2xl text-white">
            <AnimatedNumber target={user.streak} />
          </span>
          <span className="text-xs text-white/70 font-body mt-1">连续天数</span>
        </motion.div>

        {/* Match Rate */}
        <motion.div
          className="glass-card p-4 rounded-jumbo flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Target size={20} className="text-jungle-mist mb-2" />
          <span className="font-display text-2xl text-jungle-mist">
            <AnimatedNumber target={progress?.matchRate ?? 0} suffix="%" />
          </span>
          <span className="text-xs text-white/70 font-body mt-1">听写匹配率</span>
        </motion.div>

        {/* Similarity Rate */}
        <motion.div
          className="glass-card p-4 rounded-jumbo flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Mic size={20} className="text-leaf-rust mb-2" />
          <span className="font-display text-2xl text-leaf-rust">
            <AnimatedNumber target={progress?.similarityRate ?? 0} suffix="%" />
          </span>
          <span className="text-xs text-white/70 font-body mt-1">口语相似度</span>
        </motion.div>
      </motion.div>

      {/* Garden Plant */}
      <motion.div
        className="glass-card p-6 rounded-jumbo mb-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GardenPlant level={user.gardenLevel} />
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-body text-white/90 text-sm">
            花园等级 <span className="text-cacao-gold font-semibold">Lv.{user.gardenLevel}</span>
          </p>
          <p className="text-xs text-white/90 font-body mt-1">
            累计学习 {user.totalStudyMinutes} 分钟
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-jumbo glass-card font-body font-semibold text-white/80 hover:text-cacao-gold hover:bg-white/15 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Home size={18} />
          返回首页
        </motion.button>
        <motion.button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-jumbo bg-cacao-gold text-jungle-deep font-body font-semibold hover:shadow-[0_4px_20px_rgba(196,149,106,0.4)] transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          明天继续
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
