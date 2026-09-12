import React from 'react';
import { useAuth } from '../context/AuthContext';
import GoldDisplay from '../components/GoldDisplay';
import { User, Mail, Shield, Key, LogOut, Award } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold font-fantasy text-rpg-purple tracking-widest uppercase flex items-center gap-1">
          <User className="w-4 h-4 text-rpg-purple" /> ACCOUNT & SETTINGS
        </span>
        <h1 className="font-fantasy font-extrabold text-2xl md:text-3xl text-rpg-text mt-1">
          HERO PROFILE SETTINGS
        </h1>
      </div>

      {/* Account Info Panel */}
      <div className="rpg-panel p-6 rounded-3xl border border-rpg-border space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-rpg-border/60">
          <div className="w-16 h-16 rounded-2xl bg-rpg-purple/20 border border-rpg-purple/50 flex items-center justify-center text-3xl font-fantasy font-bold text-rpg-purple">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="font-fantasy font-bold text-xl text-rpg-text">{user?.name}</h2>
            <p className="text-xs text-rpg-purple font-semibold">{user?.title || 'Apprentice Wanderer'} (Level {user?.level || 1})</p>
            <p className="text-xs text-rpg-muted mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          <h3 className="font-fantasy font-bold text-sm text-rpg-text flex items-center gap-2">
            <Key className="w-4 h-4 text-rpg-gold" /> SECURITY & AUTHENTICATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border">
              <span className="text-rpg-muted block mb-1">Account Holder</span>
              <span className="font-semibold text-white">{user?.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border">
              <span className="text-rpg-muted block mb-1">Registered Email</span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border">
              <span className="text-rpg-muted block mb-1">Session Token Status</span>
              <span className="font-semibold text-emerald-400">Active (JWT Secured)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border">
              <span className="text-rpg-muted block mb-1">Database Sync</span>
              <span className="font-semibold text-rpg-blue">MongoDB Authoritative</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-rpg-border/60">
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-fantasy font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> EXIT REALM & LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
