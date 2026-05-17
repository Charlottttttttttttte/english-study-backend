import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, BookOpen, Users, BarChart3, Edit3, Check, X } from 'lucide-react';
import { supabase } from '../api/client';
import { logout, isAdmin } from '../api/auth';
import type { StudyMaterial } from '../types';

interface UserItem {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'materials' | 'users' | 'stats'>('materials');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProgress: 0, completedDays: 0 });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<StudyMaterial | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [navigate]);

  const loadMaterials = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('materials').select('*').order('day_index');
      if (error) throw error;
      setMaterials((data || []).map((m: any) => ({
        date: `day${m.day_index}`,
        videoSrc: m.video_src || '',
        videoPoster: '/jungle-bg-layer-2.jpg',
        audioSrc: m.audio_src || '',
        title: m.title || '',
        originalText: m.original_text || '',
        translatedText: m.translated_text || '',
      })));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers((data || []).map((u: any) => ({ id: String(u.id), username: u.username, role: u.role, created_at: u.created_at })));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: progressCount } = await supabase.from('progress').select('*', { count: 'exact', head: true });
      const { count: completedCount } = await supabase.from('progress').select('*', { count: 'exact', head: true }).eq('completed', true);
      setStats({
        totalUsers: userCount || 0,
        totalProgress: progressCount || 0,
        completedDays: completedCount || 0,
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'materials') loadMaterials();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'stats') loadStats();
  }, [activeTab, loadMaterials, loadUsers, loadStats]);

  const startEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setEditForm({ ...materials[index] });
    setSaved(false);
  }, [materials]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditForm(null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editForm || editingIndex === null) return;
    setLoading(true);
    try {
      const dayIndex = editingIndex + 1;
      const { error } = await supabase.from('materials').update({
        audio_src: editForm.audioSrc,
        video_src: editForm.videoSrc,
        title: editForm.title,
        original_text: editForm.originalText,
        translated_text: editForm.translatedText,
      }).eq('day_index', dayIndex);

      if (error) throw error;
      setSaved(true);
      setEditingIndex(null);
      setEditForm(null);
      loadMaterials();
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [editForm, editingIndex, loadMaterials]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!window.confirm('确定删除此用户？')) return;
    try {
      await supabase.from('users').delete().eq('id', userId);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadUsers]);

  const handleToggleRole = useCallback(async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadUsers]);

  const tabs = [
    { key: 'materials' as const, label: '学习资源', icon: BookOpen },
    { key: 'users' as const, label: '用户管理', icon: Users },
    { key: 'stats' as const, label: '数据统计', icon: BarChart3 },
  ];

  return (
    <div className="pt-8 pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <motion.button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/90 hover:text-cacao-gold transition-colors font-body text-sm" whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
            <ArrowLeft size={18} />
            返回日历
          </motion.button>
          <motion.button onClick={logout} className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors font-body text-sm" whileTap={{ scale: 0.95 }}>
            <LogOut size={16} />
            退出
          </motion.button>
        </div>
        <h1 className="font-display text-3xl text-cacao-cream text-center">管理后台</h1>
      </motion.div>

      <div className="flex gap-2 mb-6 bg-white/5 rounded-full p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-body transition-all ${activeTab === tab.key ? 'bg-cacao-gold text-jungle-deep font-semibold' : 'text-white/70'}`}>
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm font-body mb-4 text-center">{error}</p>}
      {saved && <motion.div className="text-center mb-4 text-jungle-mist font-body text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✅ 已保存</motion.div>}

      {activeTab === 'materials' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {materials.map((m, i) => (
            <motion.div key={i} className="glass-card p-5 rounded-jumbo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {editingIndex === i && editForm ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-body font-semibold text-cacao-gold">Day {i + 1}: {m.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="p-1.5 rounded-full bg-jungle-mist/20 text-jungle-mist hover:bg-jungle-mist/30"><Check size={16} /></button>
                      <button onClick={cancelEdit} className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"><X size={16} /></button>
                    </div>
                  </div>
                  <div><label className="text-white/70 text-xs font-body mb-1 block">音频链接</label><input type="text" value={editForm.audioSrc} onChange={(e) => setEditForm({ ...editForm, audioSrc: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" /></div>
                  <div><label className="text-white/70 text-xs font-body mb-1 block">视频链接</label><input type="text" value={editForm.videoSrc} onChange={(e) => setEditForm({ ...editForm, videoSrc: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" /></div>
                  <div><label className="text-white/70 text-xs font-body mb-1 block">标题</label><input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" /></div>
                  <div><label className="text-white/70 text-xs font-body mb-1 block">英文原文</label><textarea value={editForm.originalText} onChange={(e) => setEditForm({ ...editForm, originalText: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs resize-none" /></div>
                  <div><label className="text-white/70 text-xs font-body mb-1 block">中文翻译</label><textarea value={editForm.translatedText} onChange={(e) => setEditForm({ ...editForm, translatedText: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs resize-none" /></div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-body font-semibold text-white/90">Day {i + 1}: {m.title}</h3>
                    <button onClick={() => startEdit(i)} className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-cacao-gold/20 hover:text-cacao-gold"><Edit3 size={14} /></button>
                  </div>
                  <p className="text-white/70 text-xs font-body truncate">{m.audioSrc}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-5 rounded-jumbo">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-body font-semibold text-white/90">用户列表</h2>
              <span className="text-white/50 text-xs font-body">共 {users.length} 人</span>
            </div>
            {users.length === 0 ? <p className="text-white/70 text-sm font-body text-center py-8">暂无用户</p> : (
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center px-4 py-2 text-white/40 text-xs font-body">
                  <span className="flex-1">用户名</span>
                  <span className="w-20 text-center">角色</span>
                  <span className="w-24 text-center">注册时间</span>
                  <span className="w-20 text-right">操作</span>
                </div>
                {users.map((u) => (
                  <div key={u.id} className="flex items-center bg-white/5 rounded-2xl px-4 py-3">
                    <span className="flex-1 font-body text-sm text-white/90 truncate">{u.username}</span>
                    <div className="w-20 text-center">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        className={`text-xs px-2 py-1 rounded-full transition-all ${u.role === 'admin' ? 'bg-cacao-gold/20 text-cacao-gold hover:bg-cacao-gold/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                      >
                        {u.role === 'admin' ? '管理员' : '用户'}
                      </button>
                    </div>
                    <span className="w-24 text-center text-white/40 text-xs font-body">
                      {new Date(u.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <div className="w-20 text-right">
                      <button onClick={() => handleDeleteUser(u.id)} className="text-white/30 hover:text-red-400 text-xs font-body transition-colors">删除</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: '总用户数', value: stats.totalUsers, color: 'text-cacao-gold' }, { label: '学习记录', value: stats.totalProgress, color: 'text-jungle-mist' }, { label: '完成打卡', value: stats.completedDays, color: 'text-frog-green' }].map((item) => (
              <div key={item.label} className="glass-card p-5 rounded-jumbo text-center">
                <p className={`font-display text-3xl ${item.color}`}>{item.value}</p>
                <p className="text-white/80 text-xs font-body mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
