import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, ArrowRight, ArrowLeft, Video, AudioLines } from 'lucide-react';
import BackButton from '../components/BackButton';
import LevelProgressBar from '../components/LevelProgressBar';
import { getMaterialForDate } from '../data/studyMaterials';
import { loadDayProgress, saveDayProgress } from '../data/storage';

export default function Level1Page() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const material = getMaterialForDate(date || 'default');
  const progress = date ? loadDayProgress(date) : null;
  const [audioMode, setAudioMode] = useState(false);

  const handleNext = useCallback(() => {
    if (!date) return;
    const dp = loadDayProgress(date);
    saveDayProgress(date, { ...dp, level1Completed: true });
    navigate(`/level2/${date}`);
  }, [date, navigate]);

  const handleBack = useCallback(() => {
    navigate(`/map/${date}`);
  }, [date, navigate]);

  return (
    <div className="pt-8 pb-8">
      <BackButton to={`/map/${date}`} label="返回地图" />

      <LevelProgressBar
        current={1}
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
          🎧 听力驿站
        </h1>
        <p className="font-body text-white/80 text-sm">{material.title}</p>
      </motion.div>

      {/* Video/Audio Player */}
      <motion.div
        className="glass-card p-4 rounded-jumbo mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!audioMode ? (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-jungle-deep/60">
            <video
              className="w-full h-full object-cover"
              poster={material.videoPoster}
              controls
            >
              <source src={material.videoSrc} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="rounded-2xl bg-jungle-deep/60 p-8 flex flex-col items-center justify-center aspect-video">
            <AudioLines size={48} className="text-cacao-gold mb-4" />
            <p className="font-body text-white/90 mb-4">纯音频模式</p>
            <audio controls className="w-full max-w-xs">
              <source src={material.audioSrc} type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div className="flex justify-center mt-3">
          <motion.button
            onClick={() => setAudioMode(!audioMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/90 hover:text-cacao-gold text-sm font-body"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {audioMode ? <Video size={16} /> : <AudioLines size={16} />}
            {audioMode ? '切换为视频模式' : '切换为音频模式'}
          </motion.button>
        </div>
      </motion.div>

      {/* Handwriting Tip */}
      <motion.div
        className="glass-card p-6 rounded-jumbo mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Headphones size={18} className="text-cacao-gold" />
          <h2 className="font-body font-semibold text-white/90">听写提示</h2>
        </div>
        <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
          请准备好纸和笔，播放视频或音频，把听到的内容尽可能准确地手写下来。
        </p>
        <div className="flex items-center gap-2 text-cacao-gold/90 text-xs font-body bg-cacao-gold/10 rounded-2xl px-4 py-3">
          <span>📝</span>
          <span>手写记录后，点击"去核对文本"对照原文检查</span>
        </div>
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
          返回地图
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-jumbo bg-cacao-gold text-jungle-deep font-body font-semibold text-sm hover:shadow-[0_4px_20px_rgba(196,149,106,0.4)] transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          去核对文本
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </div>
  );
}
