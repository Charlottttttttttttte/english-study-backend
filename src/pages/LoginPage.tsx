import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { register, login, saveToken } from '../api/auth';
import { loginLocal, saveApiUser } from '../data/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [useLocal, setUseLocal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

      if (useLocal) {
        // Local preset accounts
        const user = loginLocal(username, password);
        if (user) {
          navigate('/');
          window.location.reload();
        } else {
          setError('用户名或密码错误（本地模式）');
        }
      } else {
        // Backend API login
        try {
          const res = isLogin
            ? await login(username, password)
            : await register(username, password);

          saveToken(res.token);
          saveApiUser(res.user);
          navigate('/');
          window.location.reload();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : '操作失败';
          // If backend unreachable, suggest local mode
          if (message.includes('Failed to fetch') || message.includes('Network')) {
            setError('无法连接到服务器，请切换到本地模式');
          } else {
            setError(message);
          }
        }
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
        {/* Back */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/90 hover:text-cacao-gold transition-colors font-body text-sm mb-6"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          返回日历
        </motion.button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-cacao-cream mb-2">
            English Study
          </h1>
          <p className="font-body text-white/80 text-sm">
            {isLogin ? '登录你的学习账号' : '创建新账号'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 rounded-jumbo">
          {/* Mode Toggle */}
          <div className="flex mb-4 bg-white/5 rounded-full p-1">
            <button
              onClick={() => { setUseLocal(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-body transition-all ${!useLocal ? 'bg-cacao-gold text-jungle-deep font-semibold' : 'text-white/60'}`}
            >
              <Wifi size={14} />
              联网模式
            </button>
            <button
              onClick={() => { setUseLocal(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-body transition-all ${useLocal ? 'bg-cacao-gold text-jungle-deep font-semibold' : 'text-white/60'}`}
            >
              <WifiOff size={14} />
              本地模式
            </button>
          </div>

          {/* Login/Register Toggle (only in API mode) */}
          {!useLocal && (
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
          )}

          {/* Mode description */}
          <p className="text-white/70 text-xs font-body text-center mb-4">
            {useLocal
              ? '本地模式：数据保存在浏览器中，无需服务器'
              : '联网模式：需要后端服务器，数据云端同步'}
          </p>

          {/* Preset accounts hint (local mode) */}
          {useLocal && (
            <div className="bg-cacao-gold/10 rounded-2xl px-4 py-3 mb-4">
              <p className="text-cacao-gold/90 text-xs font-body">
                <strong>管理员：</strong>admin / admin123<br/>
                <strong>游客：</strong>guest / guest123
              </p>
            </div>
          )}

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

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-jumbo font-body font-semibold text-sm bg-cacao-gold text-jungle-deep shadow-[0_4px_20px_rgba(196,149,106,0.4)] hover:shadow-[0_6px_28px_rgba(196,149,106,0.55)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? '请稍候...' : isLogin || useLocal ? (
                <><LogIn size={16} /> 登录</>
              ) : (
                <><UserPlus size={16} /> 注册</>
              )}
            </motion.button>
          </form>

          <p className="text-white/60 text-xs font-body text-center mt-4">
            不登录也可以直接使用，数据保存在本地
          </p>
        </div>
      </motion.div>
    </div>
  );
}
