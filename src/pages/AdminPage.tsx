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
      await t
