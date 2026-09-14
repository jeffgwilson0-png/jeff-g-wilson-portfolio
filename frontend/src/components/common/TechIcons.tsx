import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const PythonIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <path
      d="M63.7 8.3c-14.7 0-24.8 6.4-24.8 18.7v13.8h25.4v3.7H29.1c-15 0-28 8.8-28 25.4 0 16.2 12.3 26.2 27.2 26.2h8.3v-12.3c0-8.8 7.5-16.1 16.3-16.1h25.4c7.3 0 13.3-6.1 13.3-13.4V27c0-13.8-12.7-18.7-27.9-18.7zm-13.9 7.6c2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7z"
      fill="url(#python-blue)"
    />
    <path
      d="M64.3 119.7c14.7 0 24.8-6.4 24.8-18.7V87.2H63.7v-3.7h35.2c15 0 28-8.8 28-25.4 0-16.2-12.3-26.2-27.2-26.2h-8.3v12.3c0 8.8-7.5 16.1-16.3 16.1H50c-7.3 0-13.3 6.1-13.3 13.4v27c0 13.8 12.7 18.7 27.6 18.7zm13.9-7.6c-2.6 0-4.7-2.1-4.7-4.7 0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7 0 2.6-2.1 4.7-4.7 4.7z"
      fill="url(#python-yellow)"
    />
    <defs>
      <linearGradient id="python-blue" x1="2" y1="10" x2="68" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#387EB8" />
        <stop offset="1" stopColor="#366994" />
      </linearGradient>
      <linearGradient id="python-yellow" x1="60" y1="58" x2="126" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE873" />
        <stop offset="1" stopColor="#FFD43B" />
      </linearGradient>
    </defs>
  </svg>
);

export const TensorFlowIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <path d="M64 8l54 31.2v31.2L98 58.7v44.6L64 120V8z" fill="#E535AB" fillOpacity="0" />
    <path d="M64 8L10 39.2v31.2l20-11.7v44.6L64 120 44 74.5V47.9l20-11.7V8z" fill="#FF6F00" />
    <path d="M64 8l54 31.2v31.2l-20-11.7v44.6L64 120l20-45.5V47.9L64 36.2V8z" fill="#FFA800" />
    <path d="M44 74.5l20 11.6v33.9L44 74.5z" fill="#FF6F00" />
    <path d="M84 74.5l-20 11.6v33.9L84 74.5z" fill="#FFA800" />
  </svg>
);

export const KerasIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <rect width="128" height="128" rx="24" fill="#D00000" />
    <path
      d="M38 28h16v32.5L78.8 28H100L69.5 61.5 102 100H80.5L54 67.5V100H38V28z"
      fill="#FFFFFF"
    />
  </svg>
);

export const ScikitLearnIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <rect width="128" height="128" rx="24" fill="#0E2D44" />
    <circle cx="50" cy="64" r="28" fill="#3499CD" />
    <circle cx="78" cy="64" r="24" fill="#F89939" />
    <path d="M50 40a28 28 0 0 1 21.6 46.2A24 24 0 0 1 50 40z" fill="#326E97" />
    <text x="64" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
      learn
    </text>
  </svg>
);

export const NumPyIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <path d="M64 12l45 26v52L64 116 19 90V38L64 12z" fill="#013243" />
    <path d="M64 12l45 26-45 26-45-26L64 12z" fill="#4DABF7" />
    <path d="M19 38l45 26v52l-45-26V38z" fill="#1C7ED6" />
    <path d="M109 38v52l-45 26V64l45-26z" fill="#228BE6" />
    <text x="64" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="30" fontWeight="900" fontFamily="sans-serif">
      NP
    </text>
  </svg>
);

export const PyTorchIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <path
      d="M74.5 22.5a3.5 3.5 0 0 1 4.9 0l6.1 6.1a3.5 3.5 0 0 1 0 4.9L73.3 45.7a28 28 0 1 1-18.6-8.2l4.9-4.9a35 35 0 1 0 23.2 10.3l11.7-11.7a10.5 10.5 0 0 0 0-14.8l-6.1-6.1a10.5 10.5 0 0 0-14.8 0L64 29.8l10.5-7.3z"
      fill="#EE4C2C"
    />
    <circle cx="86" cy="36" r="5" fill="#EE4C2C" />
  </svg>
);
