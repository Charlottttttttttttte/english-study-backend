import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, BookOpen, Users, BarChart3, Edit3, Check, X, Trash2 } from 'lucide-react';
import { tcb } from '../api/client';
import { logout, isAdmin, isLoggedIn } from '../api/auth';
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
    if (!isLoggedIn()) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [navigate]);

  const loadMaterials = useCallback(async () => {
    try {
      const { data } = await tcb.database().collection('materials').orderBy('day_index', 'asc').get();
      setMaterials((data || []).map((m: any) => ({
        date: `day${m.day_index}`,
        videoSrc: m.video_src || '',
        videoPoster: './jungle-bg-layer-2.jpg',
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
      const { data } = await tcb.database().collection('users').get();
      setUsers((data || []).map((u: any) => ({
        id: String(u.id || u._id),
        username: u.username,
        role: u.role,
        created_at: u.created_at,
      })));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const { data: usersData } = await tcb.database().collection('users').get();
      const { data: progressData } = await tcb.database().collection('progress').get();
      const completedCount = (progressData || []).filter((p: any) => p.completed).length;

      setStats({
        totalUsers: (usersData || []).length,
        totalProgress: (progressData || []).length,
        completedDays: completedCount,
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
      const { data } = await tcb.database().collection('materials').where({ day_index: dayIndex }).get();

      if (data && data.length > 0) {
        const docId = data[0].id || data[0]._id;
        await tcb.database().collection('materials').doc(docId).update({
          audio_src: editForm.audioSrc,
          video_src: editForm.videoSrc,
          title: editForm.title,
          original_text: editForm.originalText,
          translated_text: editForm.translatedText,
        });
      }

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

  const handleDeleteMaterial = useCallback(async (index: number) => {
    if (!window.confirm('确定清空此学习资源的所有内容？\n\n这将删除：\n• 音频链接\n• 视频链接\n• 标题\n• 原文和翻译\n\n此操作不可恢复！')) return;
    setLoading(true);
    try {
      const dayIndex = index + 1;
      const { data } = await tcb.database().collection('materials').where({ day_index: dayIndex }).get();

      if (data && data.length > 0) {
        const docId = data[0].id || data[0]._id;
        await tcb.database().collection('materials').doc(docId).update({
          audio_src: '',
          video_src: '',
          title: '',
          original_text: '',
          translated_text: '',
        });
      }

      loadMaterials();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadMaterials]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!window.confirm('确定删除此用户？')) return;
    try {
      await tcb.database().collection('users').doc(userId).remove();
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadUsers]);

  const handleToggleRole = useCallback(async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await tcb.database().collection('users').doc(userId).update({ role: newRole });
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
                    <h3 className="font-body font-semibold text-white/90">Day {i + 1}: {m.title || '（未设置）'}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(i)} className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-cacao-gold/20 hover:text-cacao-gold"><Edit3 size={14} /></button>
                      <button onClick={() => handleDeleteMaterial(i)} className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-400" title="清空资源"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className={`text-xs font-body truncate ${m.audioSrc ? 'text-white/70' : 'text-white/30'}`}>{m.audioSrc || '暂无音频'}</p>
                  {!m.title && !m.audioSrc && (
                    <span className="inline-block mt-1 text-xs text-white/30 font-body">⚠️ 此资源为空</span>
                  )}
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
