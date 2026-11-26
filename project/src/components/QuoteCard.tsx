interface QuoteCardProps {
  text: string;
  isFictional?: boolean;
}

export function QuoteCard({ text }: QuoteCardProps) {
  // Adaptive font size based on text length
  const len = text.length;
  const fontSize =
    len > 240 ? 'text-sm sm:text-base' :
    len > 160 ? 'text-base sm:text-lg' :
    len > 90 ? 'text-lg sm:text-xl' :
    'text-xl sm:text-2xl';

  return (
    <div className="relative px-6 py-5 sm:px-10 sm:py-6 text-center">
      {/* Large decorative quote marks */}
      <span
        className="absolute top-1 left-2 sm:left-4 font-display text-4xl sm:text-5xl text-[var(--color-yellow)]/30 select-none leading-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <span
        className="absolute bottom-0 right-2 sm:right-4 font-display text-4xl sm:text-5xl text-[var(--color-yellow)]/30 select-none leading-none pointer-events-none"
        aria-hidden="true"
      >
        &rdquo;
      </span>

      <p className={`${fontSize} font-semibold text-[var(--color-ink)] leading-relaxed px-3 sm:px-6`}>
        {text}
      </p>

      <p className="mt-3 text-xs font-pixel uppercase tracking-widest text-[var(--color-purple)]/60">
        ¿Quién dijo esta frase?
      </p>
    </div>
  );
}
