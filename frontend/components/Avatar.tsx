"use client";

import { useEffect, useState } from 'react';

interface AvatarProps {
  age: number;
  income: number;
  riskTolerance: 'low' | 'medium' | 'high';
  size?: 'small' | 'medium' | 'large';
}

export default function Avatar({ age, income, riskTolerance, size = 'medium' }: AvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    const animateInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(animateInterval);
    };
  }, []);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56'
  };

  const isOlder = age > 45;
  const hasGlasses = age > 50 || (income > 800000 && riskTolerance === 'low');
  const skinTone = '#FDBCB4';
  const hairColor = isOlder ? '#D1D5DB' : '#4B5563';
  const shirtColor = riskTolerance === 'high' ? '#725BF4' : riskTolerance === 'medium' ? '#00A175' : '#374151';
  const wealthLevel = income > 1000000 ? 'high' : income > 500000 ? 'medium' : 'low';

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-full shadow-2xl ${isAnimating ? 'animate-pulse' : ''}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </radialGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={shirtColor} />
            <stop offset="100%" stopColor={shirtColor} stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        
        {wealthLevel === 'high' && (
          <circle cx="100" cy="100" r="90" fill="none" stroke="#725BF4" strokeWidth="3" strokeDasharray="10,5" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 100 100;360 100 100"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        <ellipse cx="100" cy="85" rx="45" ry="50" fill={skinTone} filter="url(#glow)" />
        <ellipse cx="100" cy="87" rx="43" ry="48" fill="rgba(0,0,0,0.05)" />
        
        <defs>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          d="M 55 65 Q 100 45 145 65 Q 145 55 100 50 Q 55 55 55 65"
          fill="url(#hairGradient)"
        />
        
        <ellipse cx="85" cy="80" rx="7" ry={isBlinking ? "1" : "7"} fill="#FFF" />
        <ellipse cx="115" cy="80" rx="7" ry={isBlinking ? "1" : "7"} fill="#FFF" />
        <ellipse cx="85" cy="80" rx="5" ry={isBlinking ? "1" : "5"} fill="#725BF4" />
        <ellipse cx="115" cy="80" rx="5" ry={isBlinking ? "1" : "5"} fill="#725BF4" />
        <ellipse cx="85" cy="80" rx="2" ry={isBlinking ? "1" : "2"} fill="#000" />
        <ellipse cx="115" cy="80" rx="2" ry={isBlinking ? "1" : "2"} fill="#000" />
        
        {!isBlinking && (
          <>
            <circle cx="87" cy="78" r="2" fill="#FFF" opacity="0.8" />
            <circle cx="117" cy="78" r="2" fill="#FFF" opacity="0.8" />
          </>
        )}
        
        <path d="M 78 72 Q 85 70 92 72" stroke="#8B7355" strokeWidth="2" fill="none" />
        <path d="M 108 72 Q 115 70 122 72" stroke="#8B7355" strokeWidth="2" fill="none" />
        
        {hasGlasses && (
          <g stroke="#2C3E50" strokeWidth="2" fill="rgba(255,255,255,0.1)">
            <circle cx="85" cy="80" r="14" />
            <circle cx="115" cy="80" r="14" />
            <line x1="99" y1="80" x2="101" y2="80" strokeWidth="3" />
            <line x1="71" y1="75" x2="65" y2="72" strokeWidth="2" />
            <line x1="129" y1="75" x2="135" y2="72" strokeWidth="2" />
            <circle cx="82" cy="77" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="112" cy="77" r="3" fill="rgba(255,255,255,0.6)" />
          </g>
        )}
        
        <ellipse cx="100" cy="90" rx="3" ry="4" fill="rgba(0,0,0,0.1)" />
        <ellipse cx="99" cy="89" rx="2" ry="3" fill="rgba(255,255,255,0.3)" />
        
        {riskTolerance === 'high' ? (
          <path d="M 88 100 Q 100 108 112 100" stroke="#725BF4" strokeWidth="2" fill="none" />
        ) : riskTolerance === 'medium' ? (
          <path d="M 90 100 Q 100 105 110 100" stroke="#00A175" strokeWidth="2" fill="none" />
        ) : (
          <path d="M 92 102 Q 100 100 108 102" stroke="#374151" strokeWidth="2" fill="none" />
        )}
        
        {isOlder && (
          <g stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none">
            <path d="M 75 75 Q 80 77 85 75" />
            <path d="M 115 75 Q 120 77 125 75" />
            <path d="M 85 95 Q 90 97 95 95" />
            <path d="M 105 95 Q 110 97 115 95" />
            <path d="M 70 85 Q 75 87 80 85" />
            <path d="M 120 85 Q 125 87 130 85" />
          </g>
        )}
        
        <rect x="88" y="130" width="24" height="18" fill={skinTone} rx="2" />
        
        <ellipse cx="100" cy="175" rx="55" ry="35" fill="url(#shirtGradient)" />
        
        <path
          d="M 85 145 L 100 158 L 115 145 L 115 170 L 85 170 Z"
          fill="url(#shirtGradient)"
        />
        
        <path d="M 85 145 L 100 158 L 115 145" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        
        {wealthLevel === 'high' && (
          <>
            <rect x="75" y="140" width="8" height="12" fill="#725BF4" rx="2" />
            <rect x="76" y="141" width="6" height="10" fill="#000" rx="1" />
            <path d="M 100 158 L 95 180 L 100 190 L 105 180 Z" fill="#00A175" />
          </>
        )}
        
        {riskTolerance === 'high' && (
          <circle cx="100" cy="100" r="98" fill="none" stroke="#725BF4" strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="98;102;98" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.02;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}