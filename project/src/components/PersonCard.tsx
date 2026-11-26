import type { Person } from '@/types';
import { Avatar } from './Avatar';
import { Check, X } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  side: 'left' | 'right';
  state: 'idle' | 'correct' | 'wrong' | 'disabled';
  onClick: () => void;
  disabled: boolean;
}

export function PersonCard({ person, side, state, onClick, disabled }: PersonCardProps) {
  const baseClasses =
    'group relative grid grid-rows-[1fr_56px] rounded-lg border-2 transition-all duration-200 cursor-pointer select-none overflow-hidden';

  const stateClasses = {
    idle: 'border-[var(--color-ink)]/15 hover:border-[var(--color-purple)] bg-white hover:shadow-arcade-sm',
    correct: 'border-green-500 bg-green-50/50',
    wrong: 'border-[var(--color-red)] bg-red-50/50 animate-shake',
    disabled: 'border-gray-200 bg-gray-50 opacity-50',
  };

  // Side accent color — red for left, purple for right (when idle)
  const sideAccent =
    state === 'idle'
      ? side === 'left'
        ? 'before:bg-[var(--color-red)]'
        : 'before:bg-[var(--color-purple)]'
      : 'before:bg-transparent';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses[state]} ${sideAccent} w-full h-full before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:z-10 before:content-['']`}
      aria-label={`${side === 'left' ? 'Izquierda' : 'Derecha'}: ${person.name}`}
    >
      {state === 'correct' && (
        <div className="absolute top-2 right-2 z-20 bg-green-500 rounded-full p-1.5 animate-in fade-in zoom-in border-2 border-white">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
      {state === 'wrong' && (
        <div className="absolute top-2 right-2 z-20 bg-[var(--color-red)] rounded-full p-1.5 animate-in fade-in zoom-in border-2 border-white">
          <X className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Image zone */}
      <div className="relative w-full h-full overflow-hidden bg-gray-100">
        <Avatar person={person} size="lg" />
      </div>

      {/* Label zone */}
      <div className="text-center w-full px-2 py-1.5 bg-white border-t border-gray-100 flex flex-col items-center justify-center">
        <p className="text-sm sm:text-base font-bold text-[var(--color-ink)] leading-tight truncate w-full">{person.name}</p>
        <p className="text-[10px] sm:text-xs text-[var(--color-purple)] mt-0.5 truncate w-full font-medium">{person.profession}</p>
      </div>
    </button>
  );
}
