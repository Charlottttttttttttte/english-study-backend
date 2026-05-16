import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, CircleStop, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import LevelProgressBar from '../components/LevelProgressBar';
import { getMaterialForDate } from '../data/studyMaterials';
import { loadDayProgress, saveDayProgress, loadUserState, saveUserState } from '../data/storage';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';

export default function Level3Page() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const material = getMaterialForDate(date || 'default');
  const progress = date ? loadDayProgress(date) : null;
  const speech = useSpeech();
  const timer = useTimer();
  const [showOriginal, setShowOriginal] = useState(false);
  const [similarityRate, setSimilarityRate] = useState(0);



  // Calculate similarity
  const calculateSimilarity = useCallback(() => {
    const origWords = material.originalText.toLowerCase().split(/\s+/);
    const transWords = speech.transcript.toLowerCase().split(/\s+/).filter(Boolean);
    if (transWords.length === 0) return 0;
    let matches = 0;
    const used = new Set<number>();
    for (const tw of transWords) {
      const cleanTw = tw.replace(/[^a-z]/g, '');
      for (let i = 0; i < origWords.length; i++) {
        if (!used.has(i)) {
          const cleanOw = origWords[i].replace(/[^a-z]/g, '');
          if (cleanTw === cleanOw) {
            matches++;
            used.add(i);
            break;
          }
        }
      }
    }
    const rate = Math.round((matches / origWords.length) * 100);
    setSimilarityRate(rate);
    return rate;
  }, [material.originalText, speech.transcript]);

  useEffect(() => {
    if (speech.transcript.length > 0) {
      calculateSimilarity();
    }
  }, [speech.transcript, calculateSimilarity]);

  const handleToggleRecording = useCallback(() => {
    if (speech.isRecording) {
      speech.stopRecording();
      timer.pause();
    } else {
      speech.resetTranscript();
      timer.reset();
      timer.start();
      speech.startRecording();
    }
  }, [speech, timer]);

  const handleBack = useCallback(() => {
    timer.pause();
    if (date) {
      const dp = loadDayProgress(date);
      saveDayProgress(date, { ...dp, transcriptText: speech.transcript, similarityRate });
    }
    navigate(`/level2/${date}`);
  }, [date, speech.transcript, similarityRate, navigate, timer]);

  const handleCheckIn = useCallback(() => {
    if (!date) return;
    timer.pause();

    const studyDuration = timer.seconds;
    const simRate = calculateSimilarity();

    // Save day progress
    const dp = loadDayProgress(date);
    saveDayProgress(date, {
      ...dp,
      transcriptText: speech.transcript,
      similarityRate: simRate,
      level3Completed: true,
      completed: true,
      studyDuration,
    });

    // Update user state
    const user = loadUserState();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = formatDate(yesterday);

    let newStreak = user.streak;
    if (user.dailyProgress[yestStr]?.completed) {
      newStreak = user.streak + 1;
    } else if (!user.dailyProgress[date]?.completed) {
      newStreak = 1;
    }

    const newUser = {
      ...user,
      streak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      totalDays: user.totalDays + (user.dailyProgress[date]?.completed ? 0 : 1),
      gardenLevel: Math.min(user.gardenLevel + (user.dailyProgress[date]?.completed ? 0 : 1), 30),
      totalStudyMinutes: user.totalStudyMinutes + Math.ceil(studyDuration / 60),
      dailyProgress: {
        ...user.dailyProgress,
        [date]: {
          ...dp,
          transcriptText: speech.transcript,
          similarityRate: simRate,
          level3Completed: true,
          completed: true,
          studyDuration,
        },
      },
    };

    saveUserState(newUser);
    navigate(`/stats/${date}`);
  }, [date, timer, speech.transcript, calculateSimilarity, navigate]);

  return (
    <div className="pt-8 pb-8">
      <BackButton to={`/level2/${date}`} label="返回核对" />

      <LevelProgressBar
        current={3}
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
          🎤 口语驿站
        </h1>
        <p className="font-body text-white/80 text-sm">跟着原文练习口语</p>
      </motion.div>

      {/* Original Text Collapsible */}
      <motion.div
        className="glass-card p-4 rounded-jumbo mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-cacao-gold" />
            <span className="font-body font-semibold text-white/80 text-sm">参考原文</span>
          </div>
          {showOriginal ? (
            <ChevronUp size={16} className="text-white/70" />
          ) : (
            <ChevronDown size={16} className="text-white/70" />
          )}
        </button>
        {showOriginal && (
          <motion.p
            className="font-body text-white/90 text-sm leading-relaxed mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {material.originalText}
          </motion.p>
        )}
      </motion.div>

      {/* Recording Section */}
      <motion.div
        className="glass-card p-6 rounded-jumbo mb-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="font-body text-white/80 text-sm mb-6 text-center">
          {speech.isRecording ? '正在录音...点击按钮停止' : '点击下方按钮开始朗读'}
        </p>

        {/* Timer */}
        <div className="mb-6">
          <span className="font-body text-2xl text-white/70 tabular-nums">
            {timer.format(timer.seconds)}
          </span>
        </div>

        {/* Recording Button */}
        <div className="relative">
          {speech.isRecording && (
            <motion.div
              className="absolute -inset-4 rounded-full border-2 border-red-500"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <motion.button
            onClick={handleToggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              speech.isRecording
                ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                : 'bg-cacao-gold shadow-[0_0_30px_rgba(196,149,106,0.3)]'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {speech.isRecording ? (
              <CircleStop size={36} className="text-white" />
            ) : (
              <Mic size={36} className="text-jungle-deep" />
            )}
          </motion.button>
        </div>

        {!speech.isSupported && (
          <p className="mt-4 text-xs text-red-400 font-body">
            您的浏览器不支持语音识别
          </p>
        )}
      </motion.div>

      {/* Transcript Display */}
      {(speech.transcript || speech.interimTranscript) && (
        <motion.div
          className="glass-card p-5 rounded-jumbo mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-body font-semibold text-white/80 mb-3">识别结果</h2>
          {speech.transcript && (
            <p className="font-body text-white/80 text-sm leading-relaxed">
              {speech.transcript}
            </p>
          )}
          {speech.interimTranscript && (
            <p className="font-body text-white/90 text-sm leading-relaxed mt-1">
              {speech.interimTranscript}
            </p>
          )}
        </motion.div>
      )}

      {/* Similarity Rate */}
      {similarityRate > 0 && (
        <motion.div
          className="glass-card p-4 rounded-jumbo mb-6 text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-xs text-white/70 font-body">口语相似度</span>
          <div className="font-display text-4xl text-shadow-glow mt-1" style={{ color: similarityRate >= 70 ? '#7BC4A8' : similarityRate >= 40 ? '#FFD166' : '#f87171' }}>
            {similarityRate}%
          </div>
        </motion.div>
      )}

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
          返回核对
        </motion.button>
        <motion.button
          onClick={handleCheckIn}
          className="flex items-center gap-2 px-6 py-3 rounded-jumbo bg-cacao-gold text-jungle-deep font-body font-semibold text-sm hover:shadow-[0_4px_20px_rgba(196,149,106,0.4)] transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ✅ 完成学习！打卡！
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </div>
  );
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
