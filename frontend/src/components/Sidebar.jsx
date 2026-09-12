import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Swords, Shield, ShoppingBag, Backpack, User, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Adventure Hub', icon: Compass },
  { path: '/quests', label: 'Quest Board', icon: Swords },
  { path: '/character', label: 'Hero Sheet', icon: Shield },
  { path: '/shop', label: 'Adventurer Shop', icon: ShoppingBag },
  { path: '/inventory', label: 'Inventory', icon: Backpack },
  { path: '/profile', label: 'Hero Profile', icon: User }
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#090B14] border-r border-rpg-border p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-rpg-muted px-3 mb-3">
          Realm Navigation
        </div>
        <nav className="space-y-1.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl font-fantasy font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-rpg-purple/30 to-indigo-900/30 text-white border border-rpg-purple/50 shadow-glow-purple'
                      : 'text-rpg-muted hover:text-white hover:bg-[#151A2D]'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-rpg-purple" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info box */}
        <div className="p-3.5 rounded-xl bg-[#111525] border border-rpg-border text-xs text-center text-rpg-muted">
          <p className="font-fantasy text-rpg-gold font-bold">LIFEQUEST v1.0</p>
          <p className="text-[10px] mt-0.5 opacity-75">Dark Fantasy RPG Suite</p>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile}></div>
          <div className="relative w-64 bg-[#090B14] border-r border-rpg-border p-5 flex flex-col h-full z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rpg-border">
              <span className="font-fantasy font-bold text-lg text-white">⚔ Realm Menu</span>
              <button onClick={onCloseMobile} className="p-1 text-rpg-muted hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-fantasy font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-rpg-purple text-white shadow-glow-purple'
                          : 'text-rpg-muted hover:text-white hover:bg-[#151A2D]'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090B14]/95 backdrop-blur-md border-t border-rpg-border py-2 px-3 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1 text-[10px] font-fantasy font-semibold transition ${
                  isActive ? 'text-rpg-purple font-bold' : 'text-rpg-muted hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
