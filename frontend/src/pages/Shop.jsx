import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { shopApi } from '../services/api';
import RewardCard from '../components/RewardCard';
import GoldDisplay from '../components/GoldDisplay';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingBag, Sparkles, Store } from 'lucide-react';

const Shop = () => {
  const { user, updateUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyingItemId, setBuyingItemId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchShopCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await shopApi.getShopItems();
      if (res.data.success) {
        setItems(res.data.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load shop catalog:', err);
      setError(err.response?.data?.message || 'Failed to connect to the Adventurer Shop merchant.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopCatalog();
  }, []);

  const handleBuyItem = async (itemId) => {
    try {
      setBuyingItemId(itemId);
      const res = await shopApi.buyItem(itemId);

      if (res.data.success) {
        const { remainingGold, message } = res.data.data;

        // Update local user gold
        updateUser({ gold: remainingGold });

        // Update shop item state to purchased
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, isOwned: true } : item));

        // Toast feedback
        setToastMessage(message || 'Item purchased successfully!');
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to purchase item');
    } finally {
      setBuyingItemId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rpg-panel p-6 rounded-3xl border border-rpg-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#151A2D] via-[#111525] to-[#1e1910]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shadow-glow-gold">
            🏪
          </div>
          <div>
            <span className="text-xs font-bold font-fantasy text-rpg-gold tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> ADVENTURER'S SHOP
            </span>
            <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-0.5">
              THE ARCANUM MERCHANT
            </h1>
            <p className="text-xs text-rpg-muted">
              Exchange hard-earned quest Gold for legendary equipment & prestige cosmetics
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-xs font-semibold text-rpg-muted">YOUR TREASURY BALANCE</span>
          <GoldDisplay amount={user?.gold || 0} size="lg" />
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-fantasy font-bold flex items-center gap-2 shadow-lg">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Shop Items Catalog */}
      <div>
        <h3 className="font-fantasy font-bold text-lg text-rpg-text mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-rpg-gold" /> AVAILABLE ARTIFACTS & EQUIPMENT
        </h3>

        {loading ? (
          <LoadingSkeleton type="card" count={8} />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchShopCatalog} />
        ) : items.length === 0 ? (
          <div className="rpg-panel p-8 rounded-2xl border border-rpg-border text-center text-xs text-rpg-muted">
            The merchant is currently restocking items. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map(item => (
              <RewardCard
                key={item.id}
                item={item}
                onBuy={handleBuyItem}
                userGold={user?.gold || 0}
                isBuying={buyingItemId === item.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
