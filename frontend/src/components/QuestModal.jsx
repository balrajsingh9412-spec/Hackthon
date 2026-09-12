import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const DIFFICULTY_REWARDS = {
  easy: { xp: 50, gold: 10, stat: 2 },
  medium: { xp: 100, gold: 20, stat: 4 },
  hard: { xp: 175, gold: 35, stat: 7 },
  epic: { xp: 300, gold: 60, stat: 12 }
};

const QuestModal = ({ isOpen, onClose, onSubmit, initialTask = null, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('intellect');
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setCategory(initialTask.category || 'intellect');
      setDifficulty(initialTask.difficulty || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setCategory('intellect');
      setDifficulty('medium');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const currentRewards = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.medium;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      category,
      difficulty
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="rpg-panel w-full max-w-lg p-6 rounded-2xl border border-emerald-500/50 shadow-glow-gold relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-rpg-border">
            <h2 className="font-fantasy font-extrabold text-xl text-rpg-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {initialTask ? 'Edit Growth Seed Details' : '🌱 Sow New Growth Seed'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-rpg-muted hover:text-white rounded-lg hover:bg-[#111525] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
                Seed / Goal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning 20-min Meditation, Complete Coding Task, Read 10 Pages..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111525] border border-rpg-border focus:border-emerald-500 focus:outline-none text-rpg-text text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe objective details, milestones, or notes..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111525] border border-rpg-border focus:border-emerald-500 focus:outline-none text-rpg-text text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111525] border border-rpg-border focus:border-emerald-500 text-rpg-text text-sm"
                >
                  <option value="intellect">🧠 Intellect / Study</option>
                  <option value="strength">⚔ Strength / Health</option>
                  <option value="vitality">💚 Vitality / Fitness</option>
                  <option value="discipline">✨ Discipline / Work</option>
                  <option value="wisdom">📖 Wisdom / Reading</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
                  Difficulty / Impact
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111525] border border-rpg-border focus:border-emerald-500 text-rpg-text text-sm"
                >
                  <option value="easy">🌱 Easy (+50 XP, +10 Gold)</option>
                  <option value="medium">🌿 Medium (+100 XP, +20 Gold)</option>
                  <option value="hard">🌳 Hard (+175 XP, +35 Gold)</option>
                  <option value="epic">👑 Epic (+300 XP, +60 Gold)</option>
                </select>
              </div>
            </div>

            {/* Live Reward Preview */}
            <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border/60">
              <span className="text-[11px] font-semibold text-rpg-muted uppercase tracking-wider block mb-2">
                Estimated Life Tree Nourishment
              </span>
              <div className="flex items-center justify-between text-xs font-fantasy font-bold">
                <span className="text-rpg-blue">+{currentRewards.xp} XP</span>
                <span className="text-rpg-gold">+{currentRewards.gold} Gold 🪙</span>
                <span className="text-emerald-400">+{currentRewards.stat} {category.toUpperCase()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#111525] hover:bg-[#1c2340] text-rpg-muted hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Sowing Seed...' : initialTask ? 'Save Changes' : '🌱 Sow Growth Seed'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuestModal;
