import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, FileText, Edit3, Check, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../api/client';
import type { StudyMaterial } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<StudyMaterial | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const startEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setEditForm({ ...materials[index] });
    setSaved(false);
  }, [materials]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditForm(null);
  }, []);

  const uploadAudioFile = useCallback(async (file: File) => {
    if (!file || !editForm) return;
    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop() || 'mp3';
      const fileName = `audio-${Date.now()}.${ext}`;
      const bucketName = 'audio-files';
      
      // Try to create bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
        if (createError && !createError.message.includes('already exists')) {
          throw new Error('请让管理员在 Supabase 后台创建 Storage Bucket：Storage → New bucket → 名称填 audio-files → 勾选 Public');
        }
      }
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      setEditForm({ ...editForm, audioSrc: publicUrl });
      setSaved(false);
    } catch (err: any) {
      setError('上传失败: ' + err.message);
    } finally {
      setUploading(false);
    }
  }, [editForm]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      uploadAudioFile(file);
    } else {
      setError('请上传音频文件（mp3/wav 等）');
    }
  }, [uploadAudioFile]);

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

  return (
    <div className="pt-8 pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/90 hover:text-cacao-gold transition-colors font-body text-sm mb-4" whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={18} />
          返回日历
        </motion.button>
        <h1 className="font-display text-3xl text-cacao-cream text-center mb-2">学习资源管理</h1>
        <p className="font-body text-white/80 text-sm text-center">9个学习材料，每天自动切换</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm font-body mb-4 text-center">{error}</p>}
      {saved && <motion.div className="text-center mb-4 text-jungle-mist font-body text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✅ 已保存</motion.div>}

      <div className="space-y-4">
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
                <div>
                  <label className="text-white/70 text-xs font-body mb-1 block">音频链接</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={editForm.audioSrc} onChange={(e) => setEditForm({ ...editForm, audioSrc: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 font-body text-xs" />
                  </div>
                  <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAudioFile(f); }} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-xl px-3 py-3 font-body text-xs transition-all cursor-pointer ${dragOver ? 'bg-cacao-gold/30 border-cacao-gold scale-[1.02]' : 'bg-cacao-gold/10 border-cacao-gold/30 text-cacao-gold hover:bg-cacao-gold/20'} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? '上传中...' : '点击或拖拽音频文件到此处'}
                  </div>
                  {editForm.audioSrc && (
                    <audio src={editForm.audioSrc} controls className="w-full mt-2 h-8" />
                  )}
                </div>
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
                <div className="flex items-center gap-2 text-white/70 text-xs font-body mb-1"><Headphones size={12} className="text-cacao-gold/70" /><span className="truncate max-w-[200px]">{m.audioSrc}</span></div>
                <div className="flex items-center gap-2 text-white/70 text-xs font-body"><FileText size={12} className="text-cacao-gold/70" /><span className="truncate max-w-[200px]">{m.originalText.substring(0, 60)}...</span></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
