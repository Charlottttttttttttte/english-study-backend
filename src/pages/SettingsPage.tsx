import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, FileText, Edit3, Check, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../api/client';
import { isLoggedIn, isAdmin } from '../api/auth';
import type { StudyMaterial } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();

  // 权限检查：未登录 → 登录页，非管理员 → 首页
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [navigate]);
  // ... 其余代码不变
