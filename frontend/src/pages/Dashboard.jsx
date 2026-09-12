import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';
import CharacterCard from '../components/CharacterCard';
import StreakCard from '../components/StreakCard';
import StatCard from '../components/StatCard';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import LevelUpModal from '../components/LevelUpModal';
import QuestCompleteModal from '../components/QuestCompleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Plus, Swords, Sparkles, Trophy } from 'lucide-react';
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

        // Update local quest state
        setTasks(prev => prev.map(t => t._id === taskId ? updatedTask : t));

        // Update global user state
        updateUser(updatedUser);

        // Show floating completion toast
        setRewardToast(rewards);
        setTimeout(() => setRewardToast(null), 4000);

        // Trigger Level Up Modal if user leveled up
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
  const completedQuests = tasks.filter(t => t.completed);

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-fantasy text-rpg-purple tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-rpg-gold" /> ADVENTURE HUB
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
            WELCOME BACK, <span className="gold-text uppercase">{user?.name || 'HERO'}</span>
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rpg-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-fantasy font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> FORGE NEW QUEST
        </button>
      </div>

      {/* Hero Summary & Streak Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CharacterCard user={user} />
        </div>
        <div>
          <StreakCard streak={user?.streak} />
        </div>
      </div>

      {/* Hero Attributes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-fantasy font-bold text-lg text-rpg-text flex items-center gap-2">
            <Trophy className="w-5 h-5 text-rpg-gold" /> HERO ATTRIBUTES
          </h3>
          <Link to="/character" className="text-xs font-semibold text-rpg-purple hover:underline">
            View Character Sheet →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard statKey="intellect" value={user?.attributes?.intellect || 10} />
          <StatCard statKey="strength" value={user?.attributes?.strength || 10} />
          <StatCard statKey="vitality" value={user?.attributes?.vitality || 10} />
          <StatCard statKey="discipline" value={user?.attributes?.discipline || 10} />
          <StatCard statKey="wisdom" value={user?.attributes?.wisdom || 10} />
        </div>
      </div>

      {/* Active Quests Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-fantasy font-bold text-lg text-rpg-text flex items-center gap-2">
            <Swords className="w-5 h-5 text-rpg-purple" /> TODAY'S ACTIVE QUESTS ({activeQuests.length})
          </h3>
          <Link to="/quests" className="text-xs font-semibold text-rpg-purple hover:underline">
            Manage All Quests →
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTasks} />
        ) : activeQuests.length === 0 ? (
          <div className="rpg-panel p-8 rounded-2xl border border-rpg-border text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h4 className="font-fantasy font-bold text-lg text-rpg-text mb-1">No Active Quests</h4>
            <p className="text-xs text-rpg-muted max-w-sm mx-auto mb-4">
              Your quest log is clear! Forge a new quest to begin gaining XP and Gold today.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rpg-purple/20 border border-rpg-purple/40 text-rpg-purple font-fantasy font-bold text-xs hover:bg-rpg-purple hover:text-white transition"
            >
              + Create First Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
