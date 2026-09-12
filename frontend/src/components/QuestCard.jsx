import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sword, Brain, Heart, Target, BookOpen, Trash2, Edit3 } from 'lucide-react';

const CATEGORY_ICONS = {
  strength: { icon: Sword, color: 'text-red-400', label: 'Strength' },
  intellect: { icon: Brain, color: 'text-blue-400', label: 'Intellect' },
  vitality: { icon: Heart, color: 'text-emerald-400', label: 'Vitality' },
  discipline: { icon: Target, color: 'text-purple-400', label: 'Discipline' },
  wisdom: { icon: BookOpen, color: 'text-amber-400', label: 'Wisdom' }
};

const DIFFICULTY_STYLES = {
  easy: { label: 'Easy', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' },
  medium: { label: 'Medium', border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-300' },
  hard: { label: 'Hard', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' },
  epic: { label: 'Epic', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300 shadow-glow-gold' }
};

const QuestCard = ({ task, onComplete, onEdit, onDelete, isCompleting = false }) => {
  const categoryInfo = CATEGORY_ICONS[task.category] || CATEGORY_ICONS.intellect;
  const CategoryIcon = categoryInfo.icon;
  const diffStyle = DIFFICULTY_STYLES[task.difficulty] || DIFFICULTY_STYLES.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`rpg-panel p-5 rounded-2xl border ${diffStyle.border} rpg-panel-hover relative flex flex-col justify-between overflow-hidden ${
        task.completed ? 'opacity-70 bg-slate-900/60 grayscale-[40%]' : ''
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${diffStyle.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {diffStyle.label}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded bg-[#111525] border border-rpg-border flex items-center gap-1 ${categoryInfo.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {categoryInfo.label}
            </span>
          </div>

          {!task.completed && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-rpg-muted hover:text-white rounded-lg hover:bg-[#111525] transition"
                  title="Edit Quest"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(task._id)}
                  className="p-1.5 text-rpg-muted hover:text-red-400 rounded-lg hover:bg-[#111525] transition"
                  title="Abandon Quest"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className={`font-fantasy font-bold text-lg mb-1.5 ${task.completed ? 'line-through text-rpg-muted' : 'text-rpg-text'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-rpg-muted line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Rewards & Action */}
      <div className="mt-4 pt-3 border-t border-rpg-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold font-fantasy">
          <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-rpg-blue border border-blue-500/30">
            +{task.xpReward || 100} XP
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-rpg-gold border border-amber-500/30">
            +{task.goldReward || 20} 🪙
          </span>
        </div>

        {task.completed ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </span>
        ) : (
          <button
            onClick={() => onComplete(task._id)}
            disabled={isCompleting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-fantasy font-bold text-xs shadow-glow-gold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isCompleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '⚔ COMPLETE'
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default QuestCard;
