import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Settings, LogIn, LogOut, Shield, User } from 'lucide-react';
import { loadDayProgress } from '../data/storage';
import { getCurrentUser, logout } from '../data/auth';
import { supabase } from '../api/client';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [materials, setMaterials] = useState<any[]>([]);

  const today = new Date();
  const todayStr = formatDate(today);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  // 加载学习资源数据（用于日历标记）
  useEffect(() => {
    async function loadMaterials() {
      try {
        const { data } = await supabase.from('materials').select('*').order('day_index');
        setMaterials(data || []);
      } catch {
        // 忽略错误（离线时使用空数组）
      }
    }
    loadMaterials();
  }, []);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDayClick = (dateStr: string) => {
    navigate(`/map/${dateStr}`);
  };

  const days = useMemo(() => {
    const result: { day: number; dateStr: string; isToday: boolean; completed: boolean; hasMaterial: boolean }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const progress = loadDayProgress(dateStr);
      // 计算该日期对应的 day_index（0-8）
      const date = new Date(dateStr + 'T00:00:00');
      const dayTimestamp = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
      const dayIndex = dayTimestamp % 9;
      const material = materials.find((m: any) => m.day_index === dayIndex + 1);
      const hasMaterial = !!(material?.audio_src || material?.title);
      result.push({
        day: d,
        dateStr,
        isToday: dateStr === todayStr,
        completed: progress.completed,
        hasMaterial,
      });
    }
    return result;
  }, [year, month, daysInMonth, todayStr, materials]);

  return (
    <div className="pt-12 pb-8">
      {/* Header */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <UserStatusBar />
        <h1 className="font-display text-4xl sm:text-5xl text-cacao-cream text-shadow-glow mb-2">English Study</h1>
        <p className="font-body text-white/90 text-sm">选择一天，开启丛林学习之旅</p>
        <motion.button onClick={() => navigate('/settings')} className="flex items-center gap-2 mx-auto mt-4 px-4 py-2 rounded-full bg-white/5 text-white/80 text-xs font-body hover:bg-white/10 hover:text-cacao-gold transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Settings size={14} />
          管理学习资源
        </motion.button>
      </motion.div>

      {/* Calendar Card */}
      <motion.div className="glass-card p-6 rounded-jumbo" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        {/* Month Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-cacao-gold" whileTap={{ scale: 0.9 }}>
            <ChevronLeft size={20} />
          </motion.button>
          <h2 className="font-display text-xl text-cacao-gold">{year}年 {monthNames[month]}</h2>
          <motion.button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-cacao-gold" whileTap={{ scale: 0.9 }}>
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayLabels.map((label) => (
            <div key={label} className="text-center text-xs font-body text-white/70 py-2">{label}</div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map((dayInfo, index) => (
            <motion.button
              key={dayInfo.dateStr}
              className={`relative aspect-square rounded-2xl flex items-center justify-center font-body text-sm font-bold transition-all duration-200 ${
                dayInfo.isToday ? 'ring-2 ring-cacao-gold ring-offset-1 ring-offset-jungle-deep/50' : ''
              } ${dayInfo.completed ? 'bg-cacao-gold text-jungle-deep' : 'bg-white/15 text-white hover:bg-white/25 hover:text-white'}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDayClick(dayInfo.dateStr)}
            >
              <span>{dayInfo.day}</span>
              {dayInfo.completed && (
                <motion.div className="absolute -top-1 -right-1 w-4 h-4 bg-jungle-deep rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
                  <Check size={10} className="text-cacao-gold" />
                </motion.div>
              )}
              {/* 新增：资源标记 - 有音频的日子显示小圆点 */}
              {dayInfo.hasMaterial && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cacao-gold" />
              )}
              {dayInfo.isToday && !dayInfo.completed && (
                <motion.div className="absolute inset-0 rounded-2xl ring-2 ring-cacao-gold" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Start - Today */}
      <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.button onClick={() => handleDayClick(todayStr)} className="glass-card px-8 py-4 rounded-jumbo font-body font-semibold text-cacao-gold hover:bg-white/15 transition-all" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          📅 今日学习 · {todayStr}
        </motion.button>
      </motion.div>
    </div>
  );
}

// User Status Bar Component
function UserStatusBar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user) {
    return (
      <motion.div className="flex justify-end mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.button onClick={() => navigate('/login')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-cacao-gold/15 text-cacao-gold text-xs font-body hover:bg-cacao-gold/25 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <LogIn size={14} />
          登录
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div className="flex items-center justify-between mb-4 px-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${user.role === 'admin' ? 'bg-cacao-gold text-jungle-deep' : 'bg-white/15 text-white/90'}`}>
          {user.avatar}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-body text-sm text-white/90">{user.name}</span>
          {user.role === 'admin' ? (
            <span className="flex items-center gap-1 text-xs text-cacao-gold bg-cacao-gold/15 px-2 py-0.5 rounded-full font-body">
              <Shield size={10} />
              管理员
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full font-body">
              <User size={10} />
              游客
            </span>
          )}
        </div>
      </div>
      <motion.button onClick={() => { logout(); window.location.reload(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/60 text-xs font-body hover:bg-white/10 hover:text-white/90 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <LogOut size={12} />
        退出
      </motion.button>
    </motion.div>
  );
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
