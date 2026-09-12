import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div className="rpg-panel p-6 rounded-2xl border border-red-500/40 bg-red-500/10 text-center max-w-md mx-auto my-6">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3 animate-bounce" />
      <h3 className="font-fantasy font-bold text-lg text-red-300 mb-1">
        SOMETHING WENT WRONG
      </h3>
      <p className="text-xs text-rpg-muted mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-fantasy font-bold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> TRY AGAIN
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
