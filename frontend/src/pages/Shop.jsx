import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { shopApi } from '../services/api';
import LifeTree from '../components/LifeTree';
import GoldDisplay from '../components/GoldDisplay';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingBag, Swords, Shield, Sparkles, CheckCircle2, Lock, Eye, Heart } from 'lucide-react';

const RARITY_COLORS = {
  Common: 'border-slate-500/50 bg-slate-500/10 text-slate-300',
  Uncommon: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  Rare: 'border-blue-500/50 bg-blue-500/10 text-blue-300 shadow-glow-blue',
  Epic: 'border-purple-500/50 bg-purple-500/10 text-purple-300 shadow-glow-gold',
  Legendary: 'border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-glow-gold',
  Mythic: 'border-pink-500/50 bg-pink-500/10 text-pink-300 animate-pulse'
};

const Shop = () => {
  const { user, updateUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('companion');
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyingId, setBuyingId] = useState(null);
  const [equipMsg, setEquipMsg] = useState(null);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await shopApi.getShopItems();
      if (res.data.success) {
        const shopItems = res.data.data.items;
        setItems(shopItems);
        if (shopItems.length > 0 && !selectedItem) {
          const firstComp = shopItems.find(i => i.category === 'companion') || shopItems[0];
          setSelectedItem(firstComp);
        }
      }
    } catch (err) {
      console.error('Failed to load Adventure Shop:', err);
      setError(err.response?.data?.message || 'Failed to fetch Adventure Shop catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const handleBuyItem = async (item) => {
    if (item.isOwned) return;
    try {
      setBuyingId(item.id);
      const res = await shopApi.buyItem(item.id);
      if (res.data.success) {
        const updatedUser = res.data.data.user || {
          ...user,
          gold: res.data.data.remainingGold
        };
        updateUser(updatedUser);

        setItems(prev => prev.map(i => i.id === item.id ? { ...i, isOwned: true } : i));
        setSelectedItem(prev => prev && prev.id === item.id ? { ...prev, isOwned: true } : prev);
        
        setEquipMsg(`🎉 Welcomed "${item.name}" into your Life Tree World!`);
        setTimeout(() => setEquipMsg(null), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to purchase item.');
    } finally {
      setBuyingId(null);
    }
  };

  const categories = [
    { id: 'companion', label: '🐾 Companions', icon: Heart },
    { id: 'helmet', label: '🛡️ Helmets', icon: Swords },
    { id: 'robe', label: '🌸 Flora Robes', icon: Shield },
    { id: 'material', label: '🧪 Potions', icon: Sparkles },
    { id: 'all', label: 'All Sanctuary Items', icon: ShoppingBag }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(i => (i.category || i.type) === selectedCategory);

  const userCompanions = user?.purchasedCompanions || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d2218] via-[#111525] to-[#161226] p-6 rounded-2xl border border-emerald-500/30">
        <div>
          <span className="text-xs font-bold font-fantasy text-emerald-400 tracking-widest uppercase flex items-center gap-1">
            <ShoppingBag className="w-4 h-4 text-rpg-gold" /> RPG LIFE TREE MARKETPLACE
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
            ADVENTURE COMPANION SHOP
          </h1>
        </div>
        <GoldDisplay amount={user?.gold || 0} size="lg" />
      </div>

      {/* Notification Toast */}
      {equipMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-fantasy font-bold text-center animate-bounce shadow-glow-gold">
          {equipMsg}
        </div>
      )}

      {/* 3-COLUMN SHOP LAYOUT WITH LIVE LIFE TREE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CATEGORIES & CATALOG (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#090B14] border border-rpg-border">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-fantasy text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-glow-gold'
                    : 'text-rpg-muted hover:text-white hover:bg-[#151A2D]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Catalog Item Cards */}
          {loading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchShopData} />
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                const rarityStyle = RARITY_COLORS[item.rarity] || 'border-slate-500/40 bg-slate-500/10 text-slate-300';
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-900/40 to-indigo-900/30 border-emerald-500 shadow-glow-gold'
                        : 'bg-[#111525] border-rpg-border hover:border-rpg-border/80 hover:bg-[#151A2D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#090B14] border border-rpg-border flex items-center justify-center text-xl shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-fantasy font-bold text-xs text-rpg-text">{item.name}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${rarityStyle}`}>
                            {item.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] text-rpg-muted line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-fantasy font-bold text-xs gold-text">🪙 {item.price}</div>
                      {item.isOwned ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> IN REALM
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-500 font-bold block mt-1">AVAILABLE</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CENTER COLUMN: LIVE LIFE TREE WORLD PREVIEW (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <LifeTree
            user={user}
            level={user?.level || 1}
            xp={user?.xp || 0}
            streak={user?.streak?.current || 0}
            companions={userCompanions}
          />
        </div>

        {/* RIGHT COLUMN: SELECTED COMPANION / ITEM DETAILS & BUY (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {selectedItem ? (
            <div className="rpg-panel p-5 rounded-2xl border border-emerald-500/40 space-y-4 bg-gradient-to-b from-[#0d2218] via-[#111525] to-[#090B14]">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[#090B14] border border-emerald-500/50 mx-auto flex items-center justify-center text-3xl shadow-glow-gold animate-bounce">
                  {selectedItem.icon}
                </div>
                <h3 className="font-fantasy font-extrabold text-base text-rpg-text">{selectedItem.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${RARITY_COLORS[selectedItem.rarity]}`}>
                    {selectedItem.rarity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 uppercase">
                    Species: {selectedItem.species || selectedItem.category || 'Companion'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-rpg-muted text-center leading-relaxed">
                {selectedItem.description}
              </p>

              {/* Stats & Requirements */}
              <div className="space-y-2 pt-2 border-t border-rpg-border/60">
                <div className="flex justify-between items-center text-xs font-fantasy">
                  <span className="text-rpg-muted">Tree Blessing:</span>
                  <span className="text-emerald-400 font-bold">{selectedItem.effect}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-fantasy">
                  <span className="text-rpg-muted">Required Level:</span>
                  <span className={(user?.level || 1) >= (selectedItem.requiredLevel || 1) ? 'text-white font-bold' : 'text-rose-400 font-bold'}>
                    Level {selectedItem.requiredLevel || 1}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-fantasy pt-1">
                  <span className="text-rpg-muted">Adoption Price:</span>
                  <span className="gold-text font-bold text-sm">🪙 {selectedItem.price} Gold</span>
                </div>
              </div>

              {/* Action Button: BUY / ADOPT */}
              <div className="space-y-2 pt-2">
                {selectedItem.isOwned ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-fantasy font-bold text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> LIVING IN YOUR LIFE TREE WORLD
                  </div>
                ) : (
                  <button
                    disabled={buyingId === selectedItem.id || (user?.gold || 0) < selectedItem.price || (user?.level || 1) < (selectedItem.requiredLevel || 1)}
                    onClick={() => handleBuyItem(selectedItem)}
                    className={`w-full py-2.5 rounded-xl font-fantasy font-extrabold text-xs shadow-glow-gold flex items-center justify-center gap-2 transition ${
                      (user?.level || 1) < (selectedItem.requiredLevel || 1) || (user?.gold || 0) < selectedItem.price
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black border border-emerald-300 active:scale-95'
                    }`}
                  >
                    {buyingId === selectedItem.id ? (
                      'ADOPTING COMPANION...'
                    ) : (user?.level || 1) < (selectedItem.requiredLevel || 1) ? (
                      <span className="flex items-center gap-1 text-rose-400">
                        <Lock className="w-4 h-4" /> REQUIRES LEVEL {selectedItem.requiredLevel}
                      </span>
                    ) : (user?.gold || 0) < selectedItem.price ? (
                      <span className="flex items-center gap-1 text-rose-400">
                        <Lock className="w-4 h-4" /> NOT ENOUGH GOLD
                      </span>
                    ) : (
                      `ADOPT FOR 🪙 ${selectedItem.price}`
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rpg-panel p-6 rounded-2xl border border-rpg-border text-center text-xs text-rpg-muted">
              Select a companion or item from the catalog to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
