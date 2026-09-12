import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { characterApi } from '../services/api';
import StatCard from '../components/StatCard';
import XPBar from '../components/XPBar';
import GoldDisplay from '../components/GoldDisplay';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Shield, Sparkles, Flame, History, Award, Scroll } from 'lucide-react';

const Character = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await characterApi.getTransactions();
        if (res.data.success) {
          setTransactions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load transaction history:', err);
        setError(err.response?.data?.message || 'Failed to load character audit history.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold font-fantasy text-rpg-purple tracking-widest uppercase flex items-center gap-1">
          <Shield className="w-4 h-4 text-rpg-purple" /> RPG CHARACTER SHEET
        </span>
        <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
          HERO PROFILE & ATTRIBUTES
        </h1>
      </div>

      {/* Hero Overview Header Banner */}
      <div className="rpg-panel p-8 rounded-3xl border border-rpg-purple/40 relative overflow-hidden bg-gradient-to-br from-[#151A2D] via-[#111525] to-[#1a122e]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar frame */}
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-rpg-purple via-rpg-blue to-amber-400 p-1 shadow-glow-purple">
              <div className="w-full h-full bg-[#090B14] rounded-2xl flex items-center justify-center text-6xl relative overflow-hidden">
                <span>🧙</span>
                <div className="absolute inset-0 bg-gradient-to-t from-rpg-purple/40 to-transparent"></div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rpg-purple text-white text-xs font-fantasy font-bold px-3 py-1 rounded-full border border-purple-300 shadow-lg whitespace-nowrap">
              Level {user?.level || 1}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 w-full text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-fantasy font-extrabold text-3xl gold-text flex items-center justify-center md:justify-start gap-2">
                  {user?.name} <Sparkles className="w-5 h-5 text-rpg-gold animate-pulse" />
                </h2>
                <p className="text-sm font-semibold text-rpg-purple tracking-wider uppercase mt-0.5">
                  {user?.title || 'Apprentice Wanderer'}
                </p>
              </div>
              <GoldDisplay amount={user?.gold || 0} size="lg" />
            </div>

            <XPBar
              currentXP={user?.xp || 0}
              requiredXP={user?.requiredXP || 100}
              level={user?.level || 1}
              showDetails={true}
              height="h-4"
            />

            {/* Streak & Joined Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold font-fantasy flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Current Streak: {user?.streak?.current || 0} Days
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rpg-purple/10 border border-rpg-purple/30 text-rpg-purple font-bold font-fantasy flex items-center gap-1.5">
                <Award className="w-4 h-4 text-rpg-purple" />
                Longest Streak: {user?.streak?.longest || 0} Days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Grid */}
      <div>
        <h3 className="font-fantasy font-bold text-lg text-rpg-text mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-rpg-gold" /> PRIMARY CHARACTER ATTRIBUTES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard statKey="intellect" value={user?.attributes?.intellect || 10} />
          <StatCard statKey="strength" value={user?.attributes?.strength || 10} />
          <StatCard statKey="vitality" value={user?.attributes?.vitality || 10} />
          <StatCard statKey="discipline" value={user?.attributes?.discipline || 10} />
          <StatCard statKey="wisdom" value={user?.attributes?.wisdom || 10} />
        </div>
      </div>

      {/* Transaction & Quest History Log */}
      <div>
        <h3 className="font-fantasy font-bold text-lg text-rpg-text mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-rpg-purple" /> RECENT HERO CHRONICLES & AUDIT LOG
        </h3>

        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : transactions.length === 0 ? (
          <div className="rpg-panel p-6 rounded-2xl border border-rpg-border text-center text-xs text-rpg-muted">
            No chronicle transactions recorded yet. Complete quests or purchase items to write your legend!
          </div>
        ) : (
          <div className="rpg-panel rounded-2xl border border-rpg-border overflow-hidden divide-y divide-rpg-border/60">
            {transactions.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1C2340]/40 transition text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    item.type === 'QUEST_REWARD' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.type === 'QUEST_REWARD' ? '⚔' : '🪙'}
                  </div>
                  <div>
                    <p className="font-semibold text-rpg-text">{item.description}</p>
                    <p className="text-[10px] text-rpg-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right font-fantasy font-bold">
                  {item.xpAmount > 0 && <span className="text-rpg-blue block">+{item.xpAmount} XP</span>}
                  {item.goldAmount !== 0 && (
                    <span className={item.goldAmount > 0 ? 'text-rpg-gold block' : 'text-red-400 block'}>
                      {item.goldAmount > 0 ? `+${item.goldAmount}` : item.goldAmount} Gold
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Character;
