import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';
import LifeTree from '../components/LifeTree';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import LevelUpModal from '../components/LevelUpModal';
import QuestCompleteModal from '../components/QuestCompleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import XPBar from '../components/XPBar';
import GoldDisplay from '../components/GoldDisplay';
import { Plus, Swords, Sparkles, Trophy, ShoppingBag, Backpack, Shield, Zap, Flame, Compass, Heart, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  // Level Up & Completion Notification States
  const [levelUpData, setLevelUpData] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [rewardToast, setRewardToast] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskApi.getTasks();
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load quests:', err);
      setError(err.response?.data?.message || 'Failed to fetch active quests from realm server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateQuest = async (questData) => {
    try {
      const res = await taskApi.createTask(questData);
      if (res.data.success) {
        setTasks(prev => [res.data.data, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quest');
    }
  };

  const handleCompleteQuest = async (taskId) => {
    try {
      setCompletingTaskId(taskId);
      const res = await taskApi.completeTask(taskId);

      if (res.data.success) {
        const { task: updatedTask, user: updatedUser, rewards, progression } = res.data.data;

        setTasks(prev => prev.map(t => t._id === taskId ? updatedTask : t));
        updateUser(updatedUser);

        setRewardToast(rewards);
        setTimeout(() => setRewardToast(null), 4000);

        if (progression && progression.leveledUp) {
          setLevelUpData(progression);
          setShowLevelUp(true);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete quest');
    } finally {
      setCompletingTaskId(null);
    }
  };

  const activeQuests = tasks.filter(t => !t.completed);
  const companions = user?.purchasedCompanions || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d2218] via-[#111525] to-[#161226] p-5 rounded-2xl border border-emerald-500/30">
        <div>
          <span className="text-[11px] font-bold font-fantasy text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rpg-gold" /> LIVING LIFE TREE SANCTUARY
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl text-rpg-text mt-0.5">
            NATURE HAVEN: <span className="gold-text uppercase">{user?.name || 'GUARDIAN'}</span>
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> 🌱 SOW NEW SEED
        </button>
      </div>

      {/* MAIN 3-COLUMN LAYOUT: CENTER IS THE LIVING LIFE TREE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TODAY'S QUESTS (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-fantasy font-bold text-base text-rpg-text flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" /> TODAY'S GROWTH SEEDS ({activeQuests.length})
            </h3>
            <Link to="/quests" className="text-xs font-semibold text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchTasks} />
          ) : activeQuests.length === 0 ? (
            <div className="rpg-panel p-6 rounded-2xl border border-rpg-border text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h4 className="font-fantasy font-bold text-sm text-rpg-text mb-1">No Active Growth Seeds</h4>
              <p className="text-xs text-rpg-muted mb-4">
                Sow a new seed to nourish your Life Tree with XP and Gold!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-fantasy font-bold text-xs hover:bg-emerald-600 hover:text-white transition"
              >
                + Sow First Seed
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {activeQuests.map(quest => (
                <QuestCard
                  key={quest._id}
                  task={quest}
                  onComplete={handleCompleteQuest}
                  isCompleting={completingTaskId === quest._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* CENTER COLUMN: MAGICAL LIVING LIFE TREE WORLD (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <LifeTree
            user={user}
            level={user?.level || 1}
            xp={user?.xp || 0}
            streak={user?.streak?.current || 0}
            companions={companions}
          />
        </div>

        {/* RIGHT COLUMN: LIFE TREE STATS & ACTIVE COMPANIONS (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Life Tree Core Overview Card */}
          <div className="rpg-panel p-5 rounded-2xl border border-emerald-500/40 space-y-4 bg-gradient-to-b from-[#0d2218] via-[#111525] to-[#090B14]">
            <div className="flex items-center justify-between border-b border-rpg-border/60 pb-3">
              <div>
                <h3 className="font-fantasy font-bold text-base text-rpg-text">{user?.name}</h3>
                <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  {user?.title || 'Apprentice Wanderer'}
                </p>
              </div>
              <GoldDisplay amount={user?.gold || 0} size="sm" />
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1">
              <XPBar
                currentXP={user?.xp || 0}
                requiredXP={user?.requiredXP || 100}
                level={user?.level || 1}
                showDetails={true}
                height="h-3"
              />
            </div>

            {/* Tree Vitality Energy Gauge */}
            <div className="p-3 rounded-xl bg-[#090B14] border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/40 animate-pulse" />
                <div>
                  <div className="text-[10px] font-bold text-rpg-muted uppercase tracking-wider">TREE VITALITY</div>
                  <div className="font-fantasy font-bold text-sm text-emerald-300">
                    {user?.energy !== undefined ? user.energy : 85} / 100
                  </div>
                </div>
              </div>
              <div className="w-20 h-2 bg-[#111525] rounded-full overflow-hidden border border-emerald-500/30 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-glow-gold"
                  style={{ width: `${user?.energy !== undefined ? user.energy : 85}%` }}
                ></div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="p-3 rounded-xl bg-[#090B14] border border-orange-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400/40" />
                <div>
                  <div className="text-[10px] font-bold text-rpg-muted uppercase tracking-wider">FLOWERING STREAK</div>
                  <div className="font-fantasy font-bold text-sm text-orange-400">
                    {user?.streak?.current || 0} Days Blooming
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Companions List */}
          <div className="rpg-panel p-5 rounded-2xl border border-rpg-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-fantasy font-bold text-xs text-rpg-muted uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rpg-gold" /> LIVING COMPANIONS ({companions.length})
              </h4>
              <Link to="/shop" className="text-[10px] text-emerald-500 hover:underline">
                Get More →
              </Link>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {companions.map((comp, idx) => (
                <div key={comp.id || idx} className="p-2.5 rounded-xl bg-[#090B14] border border-rpg-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{comp.icon || '🐦'}</span>
                    <div>
                      <div className="font-fantasy font-bold text-white">{comp.name}</div>
                      <div className="text-[10px] text-rpg-muted">{comp.rarity || 'Common'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>



      {/* Create Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuest}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        levelData={levelUpData}
      />

      {/* Completion Reward Toast */}
      <QuestCompleteModal
        rewardData={rewardToast}
        onClose={() => setRewardToast(null)}
      />
    </div>
  );
};

export default Dashboard;
