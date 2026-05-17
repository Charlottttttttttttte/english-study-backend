import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, BookOpen, Users, BarChart3, Edit3, Check, X } from 'lucide-react';
import { supabase } from '../api/client';
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
      // 未登录 → 跳到登录页
      navigate('/login');
    } else if (!isAdmin()) {
      // 已登录但不是管理员 → 跳到首页
      navigate('/');
    }
  }, [navigate]);
  // ... 其余代码不变
