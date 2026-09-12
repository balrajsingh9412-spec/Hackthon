import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try another email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rpg-purple/15 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rpg-panel w-full max-w-md p-8 rounded-3xl border border-rpg-purple/40 shadow-glow-purple relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rpg-purple/20 border border-rpg-purple/40 text-3xl mb-3">
            🧙
          </div>
          <h2 className="font-fantasy font-extrabold text-2xl text-rpg-text">
            Forge Hero Character
          </h2>
          <p className="text-xs text-rpg-muted mt-1">
            Begin your journey to level up your real life
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
              Hero / Adventurer Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-rpg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shadow Vanguard"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111525] border border-rpg-border focus:border-rpg-purple focus:outline-none text-rpg-text text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-rpg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@realm.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111525] border border-rpg-border focus:border-rpg-purple focus:outline-none text-rpg-text text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-rpg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111525] border border-rpg-border focus:border-rpg-purple focus:outline-none text-rpg-text text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rpg-muted uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 text-rpg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111525] border border-rpg-border focus:border-rpg-purple focus:outline-none text-rpg-text text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rpg-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-fantasy font-bold text-sm shadow-glow-purple transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Hero...' : 'FORGE CHARACTER ⚔'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-rpg-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-rpg-purple font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
