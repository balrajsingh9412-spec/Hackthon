import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import LevelUpModal from '../components/LevelUpModal';
import QuestCompleteModal from '../components/QuestCompleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Swords, Plus, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

const Quests = () => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  // Level Up & Rewards
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
      setError(err.response?.data?.message || 'Failed to load quests from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveQuest = async (questData) => {
    try {
      if (editingTask) {
        const res = await taskApi.updateTask(editingTask._id, questData);
        if (res.data.success) {
          setTasks(prev => prev.map(t => t._id === editingTask._id ? res.data.data : t));
        }
      } else {
        const res = await taskApi.createTask(questData);
        if (res.data.success) {
          setTasks(prev => [res.data.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save quest');
    }
  };

  const handleDeleteQuest = async (taskId) => {
    if (!window.confirm('Are you sure you want to abandon this quest?')) return;
    try {
      const res = await taskApi.deleteTask(taskId);
      if (res.data.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete quest');
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

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-fantasy text-emerald-500 tracking-widest uppercase flex items-center gap-1">
            <Swords className="w-4 h-4 text-emerald-500" /> REALM GROWTH LOG
          </span>
          <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
            GROWTH BOARD
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" /> SOW NEW SEED
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="rpg-panel p-4 rounded-2xl border border-rpg-border flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-rpg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search seed title or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111525] border border-rpg-border focus:border-emerald-500 focus:outline-none text-rpg-text text-xs"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-[#111525] p-1 rounded-xl border border-rpg-border text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg transition ${statusFilter === 'active' ? 'bg-emerald-500 text-white font-bold' : 'text-rpg-muted hover:text-white'}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg transition ${statusFilter === 'completed' ? 'bg-emerald-500 text-white font-bold' : 'text-rpg-muted hover:text-white'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${statusFilter === 'all' ? 'bg-emerald-500 text-white font-bold' : 'text-rpg-muted hover:text-white'}`}
            >
              All
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#111525] border border-rpg-border text-xs text-rpg-text focus:outline-none"
          >
            <option value="all">All Attributes</option>
            <option value="intellect">🧠 Intellect</option>
            <option value="strength">⚔️ Strength</option>
            <option value="vitality">❤️ Vitality</option>
            <option value="discipline">🎯 Discipline</option>
            <option value="wisdom">📚 Wisdom</option>
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#111525] border border-rpg-border text-xs text-rpg-text focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🔵 Medium</option>
            <option value="hard">🟠 Hard</option>
            <option value="epic">🔴 Epic</option>
          </select>
        </div>
      </div>

      {/* Quest Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTasks} />
      ) : filteredTasks.length === 0 ? (
        <div className="rpg-panel p-10 rounded-2xl border border-rpg-border text-center">
          <div className="text-4xl mb-3">📜</div>
          <h3 className="font-fantasy font-bold text-lg text-rpg-text mb-1">
            No Matching Seeds Found
          </h3>
          <p className="text-xs text-rpg-muted max-w-sm mx-auto mb-4">
            Try adjusting your search terms or filter criteria, or sow a new seed!
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 font-fantasy font-bold text-xs hover:bg-emerald-500 hover:text-white transition"
          >
            + Sow New Seed
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(quest => (
            <QuestCard
              key={quest._id}
              task={quest}
              onComplete={handleCompleteQuest}
              onEdit={(t) => {
                setEditingTask(t);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteQuest}
              isCompleting={completingTaskId === quest._id}
            />
          ))}
        </div>
      )}

      {/* Seed Forge/Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveQuest}
        initialTask={editingTask}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        levelData={levelUpData}
      />

      {/* Completion Toast */}
      <QuestCompleteModal
        rewardData={rewardToast}
        onClose={() => setRewardToast(null)}
      />
    </div>
  );
};

export default Quests;
