import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, FileText, Edit3, Check, X, Upload, Loader2, Plus, Trash2, Calendar, Video, Music } from 'lucide-react';
import { tcb } from '../api/client';
import { isLoggedIn, isAdmin } from '../api/auth';

interface MaterialRecord {
  id?: string;
  _id?: string;
  day_index: number;
  audio_src: string;
  video_src: string;
  title: string;
  original_text: string;
  translated_text: string;
}

export default function SettingsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [navigate]);

  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<MaterialRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMaterials = useCallback(async () => {
    try {
      const { data } = await tcb.database().collection('materials').orderBy('day_index', 'asc').get();
      setMaterials(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const getNextDayIndex = useCallback(() => {
    if (materials.length === 0) return 1;
    return Math.max(...materials.map(m => m.day_index)) + 1;
  }, [materials]);

  const startEdit = useCallback((index: number, isNew: boolean = false) => {
    if (isNew) {
      setEditForm({
        day_index: getNextDayIndex(),
        audio_src: '',
        video_src: '',
        title: '',
        original_text: '',
        translated_text: '',
      });
      setEditingIndex(-1);
    } else {
      setEditForm({ ...materials[index] });
      setEditingIndex(index);
    }
    setSaved(false);
  }, [materials, getNextDayIndex]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditForm(null);
  }, []);

  // 读取TXT文件内容（完全免费，浏览器本地读取）
  const readTxtFile = useCallback((file: File, field: 'original' | 'translated') => {
    if (!file || !editForm) return;
    if (!file.name.endsWith('.txt')) {
      setError('请上传 .txt 格式的文本文件');
      return;
    }
    setLoading(true);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string || '';
      if (field === 'original') {
        setEditForm({ ...editForm, original_text: content });
      } else {
        setEditForm({ ...editForm, translated_text: content });
      }
      setLoading(false);
      setSaved(false);
    };
    reader.onerror = () => {
      setError('读取文件失败');
      setLoading(false);
    };
    reader.readAsText(file);
  }, [editForm]);

  const saveEdit = useCallback(async () => {
    if (!editForm) return;
    setLoading(true);
    try {
      if (editingIndex === -1) {
        const result = await tcb.database().collection('materials').add({
          day_index: editForm.day_index,
          audio_src: editForm.audio_src,
          video_src: editForm.video_src,
          title: editForm.title,
          original_text: editForm.original_text,
          translated_text: editForm.translated_text,
        });
        if (result && result.id) {
          setMaterials(prev => [...prev, { ...editForm, id: result.id }]);
        }
      } else if (editingIndex !== null && materials[editingIndex]) {
        const doc = materials[editingIndex];
        const docId = doc.id || doc._id;
        if (!docId) throw new Error('文档ID不存在');
        await tcb.database().collection('materials').doc(docId).update({
          audio_src: editForm.audio_src,
          video_src: editForm.video_src,
          title: editForm.title,
          original_text: editForm.original_text,
          translated_text: editForm.translated_text,
        });
        const newMaterials = [...materials];
        newMaterials[editingIndex] = { ...editForm, id: docId };
        setMaterials(newMaterials);
      }

      setSaved(true);
      setEditingIndex(null);
      setEditForm(null);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  }, [editForm, editingIndex, materials]);

  const handleDelete = useCallback(async (index: number) => {
    const doc = materials[index];
    const docId = doc.id || doc._id;
    if (!docId) return;
    if (!window.confirm(`确定删除 Day ${doc.day_index} 的所有内容？此操作不可恢复！`)) return;

    setLoading(true);
    try {
      await tcb.database().collection('materials').doc(docId).remove();
      setMaterials(prev => prev.filter((_, i) => i !== index));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [materials]);

  const isEmpty = (m: MaterialRecord) => !m.title && !m.audio_src && !m.original_text;

  return (
    <div className="pt-8 pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/90 hover:text-cacao-gold transition-colors font-body text-sm mb-4" whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={18} />
          返回日历
        </motion.button>
        <h1 className="font-display text-3xl text-cacao-cream text-center mb-2">学习资源管理</h1>
        <p className="font-body text-white/80 text-sm text-center">已创建 {materials.length} 天的学习材料</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm font-body mb-4 text-center">{error}</p>}
      {saved && <motion.div className="text-center mb-4 text-jungle-mist font-body text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✅ 已保存</motion.div>}

      <motion.button
        onClick={() => startEdit(0, true)}
        className="w-full glass-card p-4 rounded-jumbo mb-4 flex items-center justify-center gap-2 text-cacao-gold hover:bg-cacao-gold/10 transition-all border border-dashed border-cacao-gold/30"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={20} />
        <span className="font-body text-sm">添加新的一天（Day {getNextDayIndex()}）</span>
      </motion.button>

      <div className="space-y-4">
        <AnimatePresence>
          {materials.map((m, i) => (
            <motion.div
              key={m.id || m._id || m.day_index}
              className={`glass-card p-5 rounded-jumbo ${isEmpty(m) ? 'border border-red-500/20' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.03 }}
            >
              {editingIndex === i ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-body font-semibold text-cacao-gold flex items-center gap-2">
                      <Calendar size={16} />
                      Day {m.day_index}: {editForm?.title || '（未命名）'}
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} disabled={loading} className="p-1.5 rounded-full bg-jungle-mist/20 text-jungle-mist hover:bg-jungle-mist/30 disabled:opacity-50">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"><X size={16} /></button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs font-body mb-1 block">标题 *</label>
                    <input type="text" value={editForm?.title || ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" placeholder="例如：调解关系" />
                  </div>

                  {/* 音频 - 粘贴七牛云链接 */}
                  <div>
                    <label className="text-white/70 text-xs font-body mb-1 flex items-center gap-1"><Music size={12} /> 音频链接 (MP3)</label>
                    <input type="text" value={editForm?.audio_src || ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, audio_src: e.target.value } : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" placeholder="粘贴七牛云音频链接..." />
                    {editForm?.audio_src && (
                      <audio src={editForm.audio_src} controls className="w-full mt-2 h-8" />
                    )}
                  </div>

                  {/* 视频 - 粘贴七牛云链接 */}
                  <div>
                    <label className="text-white/70 text-xs font-body mb-1 flex items-center gap-1"><Video size={12} /> 视频链接 (MP4)</label>
                    <input type="text" value={editForm?.video_src || ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, video_src: e.target.value } : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" placeholder="粘贴七牛云视频链接..." />
                    {editForm?.video_src && (
                      <video src={editForm.video_src} controls className="w-full mt-2 rounded-lg max-h-40 object-cover" />
                    )}
                  </div>

                  {/* 英文原文 + 免费TXT导入 */}
                  <div>
                    <label className="text-white/70 text-xs font-body mb-1 flex items-center gap-1"><FileText size={12} /> 英文原文 *</label>
                    <label className="inline-flex items-center gap-1 mb-2 text-xs font-body text-cacao-gold/80 hover:text-cacao-gold cursor-pointer transition-colors">
                      <Upload size={12} /> 从 .txt 文件导入（免费）
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) readTxtFile(f, 'original'); e.currentTarget.value = ''; }}
                      />
                    </label>
                    <textarea value={editForm?.original_text || ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, original_text: e.target.value } : null)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs resize-none" placeholder="输入英文原文，或上方导入 .txt 文件..." />
                  </div>

                  {/* 中文翻译 + 免费TXT导入 */}
                  <div>
                    <label className="text-white/70 text-xs font-body mb-1 flex items-center gap-1"><FileText size={12} /> 中文翻译</label>
                    <label className="inline-flex items-center gap-1 mb-2 text-xs font-body text-cacao-gold/80 hover:text-cacao-gold cursor-pointer transition-colors">
                      <Upload size={12} /> 从 .txt 文件导入（免费）
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) readTxtFile(f, 'translated'); e.currentTarget.value = ''; }}
                      />
                    </label>
                    <textarea value={editForm?.translated_text || ''} onChange={(e) => setEditForm(prev => prev ? { ...prev, translated_text: e.target.value } : null)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs resize-none" placeholder="输入中文翻译，或上方导入 .txt 文件（可选）..." />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-body font-semibold text-white/90 flex items-center gap-2">
                      <Calendar size={16} className="text-cacao-gold/70" />
                      Day {m.day_index}: {m.title || '（未命名）'}
                    </h3>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(i)} className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-cacao-gold/20 hover:text-cacao-gold"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(i)} className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-400" title="删除"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-body mb-1">
                    <Headphones size={12} className={m.audio_src ? 'text-cacao-gold/70' : 'text-red-400/50'} />
                    <span className={`truncate max-w-[250px] ${!m.audio_src ? 'text-red-400/50' : ''}`}>{m.audio_src || '暂无音频'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-body mb-1">
                    <FileText size={12} className={m.original_text ? 'text-cacao-gold/70' : 'text-red-400/50'} />
                    <span className={`truncate max-w-[250px] ${!m.original_text ? 'text-red-400/50' : ''}`}>
                      {m.original_text ? m.original_text.substring(0, 60) + '...' : '暂无原文'}
                    </span>
                  </div>
                  {m.translated_text && (
                    <div className="flex items-center gap-2 text-white/50 text-xs font-body">
                      <span className="truncate max-w-[250px]">{m.translated_text.substring(0, 60)}...</span>
                    </div>
                  )}
                  {isEmpty(m) && (
                    <span className="inline-block mt-2 text-xs text-red-400/70 font-body bg-red-400/10 px-2 py-1 rounded-full">⚠️ 点击编辑按钮完善内容</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {materials.length === 0 && (
          <div className="text-center py-12 text-white/50 font-body text-sm">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>还没有学习材料</p>
            <p className="mt-1">点击上方「添加新的一天」开始创建</p>
          </div>
        )}
      </div>
    </div>
  );
}
