import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, ArrowLeft, Play, Pause, Gauge } from 'lucide-react';
import BackButton from '../components/BackButton';
import LevelProgressBar from '../components/LevelProgressBar';
import { getMaterialForDate } from '../data/studyMaterials';
import { loadDayProgress, saveDayProgress } from '../data/storage';

export default function Level2Page() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const material = getMaterialForDate(date || 'default');
  const progress = date ? loadDayProgress(date) : null;
  const [slowSpeed, setSlowSpeed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleNext = useCallback(() => {
    if (date) {
      const dp = loadDayProgress(date);
      saveDayProgress(date, { ...dp, level2Completed: true });
    }
    navigate(`/level3/${date}`);
  }, [date, navigate]);

  const handleBack = useCallback(() => {
    navigate(`/level1/${date}`);
  }, [date, navigate]);

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = slowSpeed ? 0.75 : 1;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(material.audioSrc);
      audio.playbackRate = slowSpeed ? 0.75 : 1;
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, slowSpeed, material.audioSrc]);

  const handleSlowSpeed = useCallback(() => {
    setSlowSpeed((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.playbackRate = next ? 0.75 : 1;
      }
      return next;
    });
  }, []);

  return (
    <div className="pt-8 pb-8">
      <BackButton to={`/level1/${date}`} label="返回再听" />

      <LevelProgressBar
        current={2}
        completed={[
          progress?.level1Completed ?? false,
          progress?.level2Completed ?? false,
          progress?.level3Completed ?? false,
        ]}
      />

      {/* Title */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl text-cacao-cream text-shadow-glow mb-1">
          📝 文本驿站
        </h1>
        <p className="font-body text-white/80 text-sm">核对原文与你的听写</p>
      </motion.div>

      {/* Original Text Card */}
      <motion.div
        className="glass-card p-5 rounded-jumbo mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-cacao-gold" />
            <h2 className="font-body font-semibold text-white/80">原文</h2>
          </div>
          <span className="text-xs text-white/90 font-body">{material.title}</span>
        </div>
        <p className="font-body text-white/70 text-sm leading-relaxed">
          {material.originalText}
        </p>
      </motion.div>

      {/* Audio Controls */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <motion.button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-cacao-gold text-jungle-deep font-body text-sm font-semibold hover:shadow-[0_4px_20px_rgba(196,149,106,0.4)] transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? '暂停' : '播放原文'}
        </motion.button>
        <motion.button
          onClick={handleSlowSpeed}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm transition-all ${
            slowSpeed
              ? 'bg-sun-glow/30 text-sun-glow border border-sun-glow/40'
              : 'bg-white/5 text-white/80 hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Gauge size={16} />
          0.75x
        </motion.button>
      </motion.div>

      {/* Check Tip */}
      <motion.div
        className="glass-card p-5 rounded-jumbo mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-body font-semibold text-white/90 mb-3">核对提示</h2>
        <p className="font-body text-white/80 text-sm leading-relaxed">
          拿出你手写的听写笔记，对照上方原文逐句检查。注意单词拼写、时态和标点符号。核对完成后，进入口语录音练习。
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-3 rounded-jumbo bg-white/5 hover:bg-white/10 text-white/90 hover:text-white transition-all font-body text-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={16} />
          返回再听
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-jumbo bg-cacao-gold text-jungle-deep font-body font-semibold text-sm hover:shadow-[0_4px_20px_rgba(196,149,106,0.4)] transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          去录音练习
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </div>
  );
}
