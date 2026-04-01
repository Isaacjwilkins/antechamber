"use client";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 280 }: LogoProps) {
  const height = (size / 280) * 320;

  return (
    <svg
      viewBox="0 0 280 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height }}
    >
      <defs>
        <linearGradient id="faceFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8d4e3" />
          <stop offset="35%" stopColor="#4fc3f7" />
          <stop offset="70%" stopColor="#7c4dff" />
          <stop offset="100%" stopColor="#4a3f8a" />
        </linearGradient>

        <linearGradient id="faceLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a4a" />
          <stop offset="50%" stopColor="#3d3d6b" />
          <stop offset="100%" stopColor="#1a1a35" />
        </linearGradient>

        <linearGradient id="faceRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a6a8a" />
          <stop offset="40%" stopColor="#4a5a7a" />
          <stop offset="100%" stopColor="#3a4a6a" />
        </linearGradient>

        <linearGradient id="faceTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f0ff" />
          <stop offset="50%" stopColor="#a8dff7" />
          <stop offset="100%" stopColor="#7cc4e8" />
        </linearGradient>

        <linearGradient id="crossbar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a4a6a" />
          <stop offset="50%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#5a6a8a" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="140" cy="310" rx="90" ry="8" fill="rgba(79,195,247,0.08)" filter="url(#glow)" />

      {/* LEFT LEG — left dark face */}
      <polygon points="140,18 60,280 38,280 115,8" fill="url(#faceLeft)" opacity="0.95" />

      {/* LEFT LEG — front face */}
      <polygon points="140,18 140,38 82,280 60,280" fill="url(#faceFront)" />

      {/* RIGHT LEG — right face */}
      <polygon points="140,18 165,8 242,280 220,280" fill="url(#faceRight)" opacity="0.95" />

      {/* RIGHT LEG — front face */}
      <polygon points="140,18 220,280 198,280 140,38" fill="url(#faceFront)" opacity="0.85" />

      {/* TOP PEAK — highlight cap */}
      <polygon points="115,8 140,18 165,8 140,0" fill="url(#faceTop)" />

      {/* Top edge glow lines */}
      <line x1="115" y1="8" x2="140" y2="0" stroke="rgba(224,240,255,0.5)" strokeWidth="0.8" />
      <line x1="140" y1="0" x2="165" y2="8" stroke="rgba(224,240,255,0.3)" strokeWidth="0.8" />

      {/* CROSSBAR — 3D bar */}
      <polygon points="92,175 188,175 198,195 82,195" fill="url(#crossbar)" filter="url(#glow)" />
      <polygon points="95,168 185,168 188,175 92,175" fill="url(#faceTop)" opacity="0.7" />
      <line x1="82" y1="195" x2="198" y2="195" stroke="rgba(79,195,247,0.3)" strokeWidth="0.5" />

      {/* INNER TRIANGLE CUTOUT */}
      <polygon points="140,55 104,175 176,175" fill="#0a0a0f" opacity="0.92" />
      <polygon points="140,55 104,175 176,175" fill="none" stroke="rgba(79,195,247,0.08)" strokeWidth="0.5" />

      {/* EDGE HIGHLIGHTS */}
      <line x1="115" y1="8" x2="38" y2="280" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
      <line x1="165" y1="8" x2="242" y2="280" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <line x1="140" y1="18" x2="60" y2="280" stroke="rgba(79,195,247,0.15)" strokeWidth="0.6" />
      <line x1="140" y1="18" x2="220" y2="280" stroke="rgba(79,195,247,0.1)" strokeWidth="0.5" />

      {/* Apex gem accent */}
      <polygon points="140,0 146,10 140,20 134,10" fill="url(#faceTop)" opacity="0.9" filter="url(#glow)" />

      {/* Base feet accents */}
      <rect x="35" y="278" width="50" height="3" rx="1.5" fill="url(#crossbar)" opacity="0.6" />
      <rect x="195" y="278" width="50" height="3" rx="1.5" fill="url(#crossbar)" opacity="0.6" />

      {/* Subtle scan line */}
      <line x1="70" y1="230" x2="210" y2="230" stroke="rgba(79,195,247,0.04)" strokeWidth="20" />
    </svg>
  );
}
