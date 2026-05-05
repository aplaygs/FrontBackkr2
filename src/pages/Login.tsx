import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      await login(res.data);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bento-card border-zinc-800"
      >
        <div className="bento-glow"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="bg-blue-500/10 w-16 h-16 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Доступ к Системе</h1>
          <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Узел входа: 0x992</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Идентификатор Протокола (Email)</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 text-white font-medium"
                placeholder="email@node.local"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Шифр Доступа (Пароль)</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 text-white font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center justify-center active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Авторизовать Вход'}
          </button>
        </form>

        <p className="mt-10 text-center text-zinc-600 text-xs font-bold uppercase tracking-wider relative z-10">
          Новое Устройство?{' '}
          <Link to="/register" className="text-white hover:text-blue-400 transition-colors">
            Инициализировать Запрос
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
