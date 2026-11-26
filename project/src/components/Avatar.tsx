import { useState } from 'react';
import type { Person } from '@/types';

interface AvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ person, size = 'lg' }: AvatarProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-full h-full text-5xl',
  };

  if (error || !person.imageUrl) {
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center font-pixel font-bold select-none`}
        style={{
          background: 'repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%) 50% / 16px 16px',
        }}
      >
        <span className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-purple-600 text-2xl">
          {person.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={person.imageUrl}
      alt={person.name}
      loading="lazy"
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
      className={`${sizeClasses[size]} object-cover transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

export function PersonAvatar({ person }: { person: Person }) {
  return <Avatar person={person} size="lg" />;
}
