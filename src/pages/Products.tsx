import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Product, Role } from '../types';
import { useAuth } from '../components/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Package, DollarSign, Tag, Info, X } from 'lucide-react';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ title: '', category: '', description: '', price: '' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const canManage = user?.role === Role.SELLER || user?.role === Role.ADMIN;
  const canDelete = user?.role === Role.ADMIN;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">DATA: <span className="text-zinc-500 uppercase">Inventory</span></h1>
          <p className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-widest">Active nodes in the network architecture</p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ title: '', category: '', description: '', price: '' });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
          >
            <Plus className="w-5 h-5" />
            Provision Unit
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
            >
              <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h2 className="text-lg font-black text-white uppercase tracking-widest">{editingProduct ? 'Modify Unit' : 'Initialize Unit'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Asset Designation</label>
                  <div className="relative">
                    <Package className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                      placeholder="e.g. CORE-STATION-X"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Domain</label>
                    <div className="relative">
                      <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                        placeholder="Hardware"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Value (Credits)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                        placeholder="000.00"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Deployment Specs</label>
                  <div className="relative">
                    <Info className="w-4 h-4 absolute left-4 top-4 text-zinc-600" />
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-white placeholder:text-zinc-700 font-medium"
                      placeholder="Detailed specifications..."
                    />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-4 border border-zinc-800 rounded-2xl font-black uppercase text-xs tracking-widest text-zinc-500 hover:bg-zinc-800 transition-colors"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 bg-white text-zinc-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                  >
                    {editingProduct ? 'Commit' : 'Initialize'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12 h-64 bg-zinc-900 rounded-[2rem] animate-pulse" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-dashed border-zinc-800 rounded-[3rem]">
           <Package className="w-16 h-16 text-zinc-700 mx-auto mb-6 opacity-50" />
           <h3 className="text-2xl font-black text-white uppercase tracking-tight">No active nodes</h3>
           <p className="text-zinc-500 mt-2 font-mono text-xs uppercase">Wait for unit provisioning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {products.map((product, idx) => {
            const isLarge = idx % 5 === 0;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} bento-card relative group flex flex-col justify-between min-h-[320px]`}
              >
                <div className="absolute top-0 right-0 p-6 flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  {canManage && (
                    <button onClick={() => handleEdit(product)} className="p-2.5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-blue-500 rounded-xl transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(product.id)} className="p-2.5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-mono text-sm font-black">
                        #{idx + 1}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono italic">{product.category}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-none group-hover:text-blue-400 transition-colors uppercase">{product.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-8">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-zinc-800 pt-6 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Asset Value</span>
                    <span className="text-3xl font-black text-white leading-none">${product.price.toLocaleString()}</span>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                    Operational
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
