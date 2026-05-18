import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { register, login, saveToken } from '../api/auth';
import { saveApiUser } from '../data/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (username.length < 3) {
        setError('用户名至少3个字符');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('密码至少6个字符');
        setLoading(false);
        return;
      }

      const res = isLogin
        ? await login(username, password)
        : await register(username, password, adminCode || undefined);

      saveToken(res.token, rememberMe);
      saveApiUser(res.user);
      navigate('/');
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '操作失败';
      if (message.includes('Failed to fetch') || message.includes('Network')) {
        setError('无法连接到服务器，请检查网络');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-12 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-cacao-cream mb-2">
            English Study
          </h1>
          <p className="font-body text-white/80 text-sm">
            {isLogin ? '登录你的学习账号' : '创建新账号'}
          </p>
        </div>

        {/* Form Card - 更透明，让丛林背景透出来 */}
        <div className="glass-card p-8 rounded-jumbo" style={{ background: 'rgba(18, 40, 30, 0.55)', backdropFilter: 'blur(8px)' }}>
          {/* Login/Register Toggle */}
          <div className="flex mb-6 bg-white/5 rounded-full p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-body transition-all ${isLogin ? 'bg-white/10 text-white font-semibold' : 'text-white/60'}`}
            >
              登录
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-body transition-all ${!isLogin ? 'bg-white/10 text-white font-semibold' : 'text-white/60'}`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-body mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/90 font-body text-sm placeholder-white/30 focus:outline-none focus:border-cacao-gold/40 focus:ring-1 focus:ring-cacao-gold/20"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-body mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6个字符"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/90 font-body text-sm placeholder-white/30 focus:outline-none focus:border-cacao-gold/40 focus:ring-1 focus:ring-cacao-gold/20"
              />
            </div>

            {/* Admin code input (only for registration) */}
            {!isLogin && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/80 text-sm font-body">管理员注册码（可选）</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminCode(!showAdminCode)}
                    className="text-cacao-gold/70 text-xs font-body hover:text-cacao-gold"
                  >
                    {showAdminCode ? '隐藏' : '显示'}
                  </button>
                </div>
                <input
                  type={showAdminCode ? 'text' : 'password'}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="输入注册码可成为管理员"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/90 font-body text-sm placeholder-white/30 focus:outline-none focus:border-cacao-gold/40 focus:ring-1 focus:ring-cacao-gold/20"
                />
                <p className="text-white/40 text-xs font-body mt-1">留空则注册为普通用户</p>
              </div>
            )}

            {/* 记住我 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-cacao-gold focus:ring-cacao-gold/40"
              />
              <label htmlFor="rememberMe" className="text-white/70 text-sm font-body cursor-pointer">
                记住我（30天免登录）
              </label>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-jumbo font-body font-semibold text-sm bg-cacao-gold text-jungle-deep shadow-[0_4px_20px_rgba(196,149,106,0.4)] hover:shadow-[0_6px_28px_rgba(196,149,106,0.55)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? '请稍候...' : isLogin ? (
                <><LogIn size={16} /> 登录</>
              ) : (
                <><UserPlus size={16} /> 注册</>
              )}
            </motion.button>
          </form>

          <p className="text-white/40 text-xs font-body text-center mt-4">
            {rememberMe ? '30天内自动登录' : '7天内自动登录'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
