import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          {/* Outer Ring */}
          <div
            className="w-20 h-20 rounded-full border-4 border-transparent animate-spin"
            style={{
              borderTopColor: 'var(--color-accent-primary)',
              borderRightColor: 'var(--color-accent-secondary)',
            }}
          ></div>
          {/* Inner Pulse */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-10 h-10 rounded-full animate-pulse"
              style={{ background: 'var(--gradient-primary)', opacity: 0.3 }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-xl font-semibold mb-2 text-white">
            Loading
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Fetching the latest stories...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: 'var(--color-accent-primary)',
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
