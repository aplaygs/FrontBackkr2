import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Initialize unit</h1>
          <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Protocol: NEW_NODE_GEN</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>Validation Success. Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 ml-1">Alias Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm text-white"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 ml-1">Surname</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm text-white"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 ml-1">Network Identity</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-9 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm text-white"
                placeholder="john@node.local"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 ml-1">Access Cipher</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-9 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center mt-6"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : 'Register Node'}
          </button>
        </form>

        <p className="mt-10 text-center text-zinc-600 text-xs font-bold uppercase tracking-wider relative z-10">
          Already synced?{' '}
          <Link to="/login" className="text-white hover:text-emerald-400 transition-colors">
            Login Node
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
