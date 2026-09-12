import React, { useState, useEffect } from 'react';
import { inventoryApi } from '../services/api';
import InventoryCard from '../components/InventoryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Backpack, Sparkles, ShieldAlert, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equippingId, setEquippingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await inventoryApi.getInventory();
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setError(err.response?.data?.message || 'Failed to retrieve sanctuary inventory contents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEquip = async (itemId) => {
    try {
      setEquippingId(itemId);
      const res = await inventoryApi.equipItem(itemId);
      if (res.data.success) {
        const { item: updatedItem, user: updatedUser } = res.data.data;
        if (updatedUser) updateUser(updatedUser);
        
        setItems(prev => prev.map(item => {
          if (item._id === itemId) return updatedItem || item;
          if (item.itemType === (updatedItem || item).itemType && (updatedItem || item).equipped) {
            return { ...item, equipped: false };
          }
          return item;
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle item equip');
    } finally {
      setEquippingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-fantasy text-emerald-500 tracking-widest uppercase flex items-center gap-1">
            <Backpack className="w-4 h-4 text-emerald-500" /> SANCTUARY STORAGE
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
            NATURE INVENTORY ({items.length})
          </h1>
        </div>

        <Link
          to="/shop"
          className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500 hover:text-white font-fantasy font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" /> Visit Nature Emporium
        </Link>
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchInventory} />
      ) : items.length === 0 ? (
        <div className="rpg-panel p-12 rounded-3xl border border-rpg-border text-center max-w-md mx-auto my-8">
          <div className="text-5xl mb-4">🎒</div>
          <h3 className="font-fantasy font-bold text-xl text-rpg-text mb-2">
            YOUR INVENTORY IS EMPTY
          </h3>
          <p className="text-xs text-rpg-muted mb-6 leading-relaxed">
            You haven't acquired any equipment or artifacts yet. Earn Gold by completing growth seeds and visit the Nature Emporium!
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Go to Nature Emporium 🪙
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(item => (
            <InventoryCard
              key={item._id}
              item={item}
              onEquip={handleEquip}
              isEquipping={equippingId === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
