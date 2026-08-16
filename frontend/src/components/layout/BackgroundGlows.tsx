import React from 'react';

export const BackgroundGlows: React.FC = () => {
  return (
    <>
      {/* Tactile Noise Texture */}
      <div className="noise-bg" />

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern opacity-60" />

      {/* Primary Cyan/Blue Ambient Glow */}
      <div className="glow-blob bg-primary w-[550px] h-[550px] top-[-100px] right-[-100px] animate-float" />

      {/* Secondary Violet Ambient Glow */}
      <div
        className="glow-blob bg-secondary w-[450px] h-[450px] bottom-[15%] left-[-80px] animate-float"
        style={{ animationDelay: '-8s' }}
      />

      {/* Subtle Central Glow */}
      <div
        className="glow-blob bg-tertiary w-[380px] h-[380px] top-[45%] right-[10%] opacity-40 animate-pulse-slow"
      />
    </>
  );
};
