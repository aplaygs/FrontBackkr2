import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types';
import { motion } from 'motion/react';
import { ShieldCheck, Package, Lock, RefreshCw } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
        <div className="flex flex-col">
          <span className="text-blue-500 text-xs font-black tracking-widest uppercase mb-1">Единая Рабочая Область</span>
          <h1 className="text-5xl font-black tracking-tighter">Проект: <span className="text-zinc-500">QUANTUM</span></h1>
        </div>
        <div className="hidden md:flex gap-12 text-right">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Статус Системы</span>
            <span className="text-emerald-400 font-mono text-sm">АКТИВНА</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Безопасность</span>
            <span className="text-white font-mono text-xl">100%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
        <div className="md:col-span-7 bento-card flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Центральный узел управления</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6 max-w-md">Безопасная экосистема для ваших данных</h2>
            <p className="text-zinc-400 leading-relaxed text-lg max-w-lg">
              Использование передовых алгоритмов для обеспечения целостности и доступности информации 
              в распределенной корпоративной среде.
            </p>
          </div>
          <div className="relative z-10 mt-12">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Системная нагрузка</span>
              <span className="text-xs text-blue-400 font-mono italic">Работа: 24/7</span>
            </div>
            <div className="h-2 bg-zinc-800 w-full rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-rows-2 gap-6">
          <div className="bg-emerald-500 rounded-[2rem] p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="flex justify-between items-start text-zinc-950">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950/20 flex items-center justify-center font-black text-2xl italic">01</div>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="text-zinc-950">
              <h3 className="text-xl font-black mb-1 uppercase tracking-tight">Безопасность JWT</h3>
              <p className="text-zinc-950/70 text-sm font-medium leading-snug">Шифрование токенов с использованием алгоритма HS256.</p>
            </div>
          </div>
          
          <div className="bento-card bg-zinc-800 flex flex-col justify-between border-zinc-700">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 font-black text-2xl italic">02</div>
              <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-lg border border-blue-500/20 uppercase">RBAC</div>
            </div>
            <div>
              <h3 className="text-xl font-black mb-1 uppercase tracking-tight text-white">Ролевой Доступ</h3>
              <p className="text-zinc-500 text-sm leading-snug">Гранулярное управление правами пользователей и продавцов.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Авторизованные маршруты */}
              <Route element={<ProtectedRoute />}>
                <Route path="/products" element={<Products />} />
              </Route>
              
              {/* Маршруты админа */}
              <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="py-8 border-t border-zinc-900 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 text-center text-zinc-700 text-sm font-medium uppercase tracking-[0.3em]">
              &copy; 2026 QUANTUM SYSTEM. Учебный проект.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
