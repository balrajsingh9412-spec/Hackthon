import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'hero') {
    return (
      <div className="rpg-panel p-6 rounded-2xl border border-rpg-border skeleton-shimmer h-36 w-full"></div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {items.map((_, i) => (
        <div key={i} className="rpg-panel p-5 rounded-2xl border border-rpg-border skeleton-shimmer h-48"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
