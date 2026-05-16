import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, FileText, Mic, CheckCircle, Lock, MapPin } from 'lucide-react';
import BackButton from '../components/BackButton';
import { loadDayProgress } from '../data/storage';

export default function MapPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const progress = date ? loadDayProgress(date) : null;
  const isCompleted = progress?.completed ?? false;
  const l1Done = progress?.level1Completed ?? false;
  const l2Done = progress?.level2Completed ?? false;
  const l3Done = progress?.level3Completed ?? false;

  const allThreeDone = l1Done && l2Done && l3Done;

  const stations = [
    {
      id: 1,
      label: '听',
      subtitle: '听力驿站',
      icon: Headphones,
      path: `/level1/${date}`,
      completed: l1Done,
      available: true,
      position: 'top',
      color: '#4A8B6F',
    },
    {
      id: 2,
      label: '核对',
      subtitle: '文本驿站',
      icon: FileText,
      path: `/level2/${date}`,
      completed: l2Done,
      available: l1Done,
      position: 'left',
      color: '#C4956A',
    },
    {
      id: 3,
      label: '说',
      subtitle: '口语驿站',
      icon: Mic,
      path: `/level3/${date}`,
      completed: l3Done,
      available: l2Done,
      position: 'right',
      color: '#FFD166',
    },
  ];

  const getStationState = (station: typeof stations[0]) => {
    if (station.completed) return 'completed';
    if (station.available) return 'available';
    return 'locked';
  };

  return (
    <div className="pt-8 pb-8">
      <BackButton to="/" label="返回日历" />

      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl text-cacao-cream text-shadow-glow mb-1">
          🏕️ 学习地图
        </h1>
        <p className="font-body text-white/80 text-sm">{date}</p>
      </motion.div>

      {/* Map Container */}
      <div className="relative max-w-md mx-auto" style={{ height: '480px' }}>
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 480" fill="none">
          {/* Line from top to left */}
          <motion.path
            d="M200 80 L100 200"
            stroke={l1Done ? '#C4956A' : 'rgba(254,254,254,0.1)'}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          {/* Line from top to right */}
          <motion.path
            d="M200 80 L300 200"
            stroke={l1Done ? '#C4956A' : 'rgba(254,254,254,0.1)'}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.45 }}
          />
          {/* Line from left to right */}
          <motion.path
            d="M100 200 L300 200"
            stroke={l2Done ? '#C4956A' : 'rgba(254,254,254,0.1)'}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          {/* Line from left to check-in */}
          <motion.path
            d="M100 200 L200 350"
            stroke={allThreeDone ? '#FFD166' : 'rgba(254,254,254,0.1)'}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
          />
          {/* Line from right to check-in */}
          <motion.path
            d="M300 200 L200 350"
            stroke={allThreeDone ? '#FFD166' : 'rgba(254,254,254,0.1)'}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
          />
        </svg>

        {/* Start marker - top center */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 0 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col items-center">
            <MapPin size={20} className="text-cacao-gold mb-1" />
            <span className="text-xs text-cacao-gold font-body">起点</span>
          </div>
        </motion.div>

        {/* Stations */}
        {stations.map((station, index) => {
          const state = getStationState(station);
          const Icon = station.icon;
          const posClass =
            station.position === 'top'
              ? 'left-1/2 -translate-x-1/2 top-16'
              : station.position === 'left'
              ? 'left-4 top-40'
              : 'right-4 top-40';

          return (
            <motion.button
              key={station.id}
              className={`absolute ${posClass} flex flex-col items-center gap-1`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * (index + 1), type: 'spring', stiffness: 200 }}
              whileHover={state !== 'locked' ? { scale: 1.1, y: -4 } : {}}
              whileTap={state !== 'locked' ? { scale: 0.95 } : {}}
              onClick={() => state !== 'locked' && navigate(station.path)}
              disabled={state === 'locked'}
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${
                  state === 'completed'
                    ? 'bg-cacao-gold shadow-[0_0_20px_rgba(196,149,106,0.4)]'
                    : state === 'available'
                    ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-white/5'
                }`}
                style={
                  state === 'available'
                    ? { backgroundColor: station.color + '30', border: `2px solid ${station.color}60` }
                    : state === 'locked'
                    ? {}
                    : {}
                }
                animate={
                  state === 'available'
                    ? { y: [0, -3, 0] }
                    : {}
                }
                transition={
                  state === 'available'
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              >
                {state === 'completed' ? (
                  <CheckCircle size={28} className="text-jungle-deep" />
                ) : state === 'locked' ? (
                  <Lock size={24} className="text-white/90" />
                ) : (
                  <Icon size={26} style={{ color: station.color }} />
                )}

                {/* Glow for completed */}
                {state === 'completed' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(196,149,106,0.2)',
                        '0 0 25px rgba(196,149,106,0.5)',
                        '0 0 10px rgba(196,149,106,0.2)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs font-body ${
                  state === 'completed'
                    ? 'text-cacao-gold'
                    : state === 'available'
                    ? 'text-white/70'
                    : 'text-white/90'
                }`}
              >
                {station.subtitle}
              </span>
            </motion.button>
          );
        })}

        {/* Check-in Station */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: '320px' }}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: allThreeDone || isCompleted ? 1 : 0.4,
            y: allThreeDone || isCompleted ? 0 : 20,
          }}
          transition={allThreeDone ? { type: 'spring', stiffness: 200, damping: 15 } : {}}
        >
          <motion.button
            className={`flex flex-col items-center gap-1 ${
              !allThreeDone && !isCompleted ? 'cursor-not-allowed' : ''
            }`}
            whileHover={allThreeDone || isCompleted ? { scale: 1.1 } : {}}
            whileTap={allThreeDone || isCompleted ? { scale: 0.95 } : {}}
            onClick={() => {
              if (allThreeDone || isCompleted) {
                navigate(`/stats/${date}`);
              }
            }}
            disabled={!allThreeDone && !isCompleted}
          >
            <motion.div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-cacao-gold shadow-[0_0_30px_rgba(196,149,106,0.5)]'
                  : allThreeDone
                  ? 'bg-sun-glow shadow-[0_0_30px_rgba(255,209,102,0.4)]'
                  : 'bg-white/5'
              }`}
              animate={
                allThreeDone && !isCompleted
                  ? { scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(255,209,102,0.3)', '0 0 40px rgba(255,209,102,0.6)', '0 0 20px rgba(255,209,102,0.3)'] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isCompleted ? (
                <CheckCircle size={36} className="text-jungle-deep" />
              ) : (
                <CheckCircle size={36} className={allThreeDone ? 'text-jungle-deep' : 'text-white/90'} />
              )}
            </motion.div>
            <span className={`text-xs font-body ${isCompleted ? 'text-cacao-gold' : allThreeDone ? 'text-sun-glow' : 'text-white/90'}`}>
              {isCompleted ? '已打卡' : allThreeDone ? '打卡!' : '打卡'}
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Progress Legend */}
      <motion.div
        className="mt-8 glass-card p-4 rounded-jumbo max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-center text-white/80 text-xs font-body">
          按顺序完成三个驿站：听 → 核对 → 说，即可打卡
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          {['听', '核对', '说'].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${
                (i === 0 ? l1Done : i === 1 ? l2Done : l3Done) ? 'bg-cacao-gold' : 'bg-white/20'
              }`} />
              <span className="text-xs text-white/80 font-body">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
