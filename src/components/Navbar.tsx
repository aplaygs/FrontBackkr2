import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, Package, Users, User as UserIcon, Shield } from 'lucide-react';
import { Role } from '../types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 font-black text-2xl tracking-tighter text-white">
              <div className="bg-blue-600 p-1.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span>QUANTUM</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link to="/products" className="inline-flex items-center px-1 pt-1 text-sm font-bold text-zinc-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-all uppercase tracking-widest">
                Товары
              </Link>
              {user?.role === Role.ADMIN && (
                <Link to="/admin" className="inline-flex items-center px-1 pt-1 text-sm font-bold text-zinc-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-all uppercase tracking-widest">
                  Админ-панель
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-0.5">Авторизован</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.first_name}</span>
                    <span className="text-[9px] text-blue-400 font-mono border border-blue-500/30 px-1.5 py-0.5 rounded-md bg-blue-500/10 uppercase tracking-tighter">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition-all"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Вход</Link>
                <Link to="/register" className="bg-white text-zinc-950 px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5">Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
