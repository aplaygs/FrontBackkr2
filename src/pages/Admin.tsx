import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { User, Role } from '../types';
import { motion } from 'motion/react';
import { Users, Trash2, ShieldCheck, Mail, Package, UserRound } from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: Role) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      await api.put(`/users/${id}`, { ...user, role });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-zinc-100">
      <div className="mb-12 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tighter uppercase">Безопасность: <span className="text-zinc-500">Персонал</span></h1>
        </div>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">Управление уровнями доступа и верификация личностей</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bento-card border-zinc-800 flex items-center gap-6">
          <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500 border border-blue-500/20">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{users.length}</div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Активные Юниты</div>
          </div>
        </div>
        <div className="bento-card border-zinc-800 flex items-center gap-6">
          <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{users.filter(u => u.role === Role.ADMIN).length}</div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Администраторы</div>
          </div>
        </div>
        <div className="bento-card border-zinc-800 flex items-center gap-6">
          <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-500 border border-purple-500/20">
            <UserRound className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{users.filter(u => u.role === Role.SELLER).length}</div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Продавцы</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Профиль Агента</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Уровень Привилегий</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Операции</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-zinc-500">
                    <div className="flex justify-center flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="font-black text-xs uppercase tracking-widest">Сканирование сети...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-zinc-500 uppercase font-bold tracking-widest">Доступ: ДАННЫЕ_ОТСУТСТВУЮТ</td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-black text-lg group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all">
                          {user.first_name[0]}
                        </div>
                        <div>
                          <div className="font-black text-white uppercase tracking-tight text-lg">{user.first_name} {user.last_name}</div>
                          <div className="text-xs text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value as Role)}
                        className="bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-blue-500 block w-44 p-3 font-black uppercase tracking-widest appearance-none cursor-pointer hover:border-zinc-600 transition-all shadow-inner"
                      >
                        <option value={Role.USER}>Пользователь</option>
                        <option value={Role.SELLER}>Продавец</option>
                        <option value={Role.ADMIN}>Администратор</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={user.email === 'admin@example.com'}
                        className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 rounded-2xl transition-all disabled:opacity-10 disabled:cursor-not-allowed shadow-sm"
                        title="Деактивировать Юнит"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
