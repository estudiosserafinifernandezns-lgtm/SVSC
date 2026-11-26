import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const PROMO_URL = 'https://quienobtuvomasvotos.lol';
const PROMO_IMAGE_URL = '/images/qomv.png';

export function PromoCard() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="w-full max-w-sm mt-8 lg:mt-0 lg:absolute lg:top-6 lg:right-6 lg:w-48 lg:max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
      <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider mb-2 text-center lg:text-left">
        Otro juegazo
      </p>
      <a
        href={PROMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="¿Quién obtuvo más votos? - Jugar ahora (se abre en una nueva pestaña)"
        className="group block bg-white border-2 border-[var(--color-ink)] rounded-lg overflow-hidden shadow-arcade-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-arcade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-purple)] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden border-b-2 border-[var(--color-ink)]">
          {imageFailed ? (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-red)]/10">
              <span className="font-display text-lg text-[var(--color-red)]">VOTOS</span>
            </div>
          ) : (
            <img
              src={PROMO_IMAGE_URL}
              alt="Urna de votación"
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/50 to-transparent pointer-events-none" />
        </div>

        <div className="p-3 space-y-2.5">
          <h3 className="font-display text-sm leading-tight text-[var(--color-ink)]">
            ¿Quién obtuvo más votos?
          </h3>
          <span className="flex items-center justify-center gap-1.5 w-full bg-[var(--color-yellow)] group-hover:bg-[var(--color-yellow-light)] text-[var(--color-ink)] font-pixel text-xs font-bold rounded-md px-3 py-2 border-2 border-[var(--color-ink)] transition-colors">
            Jugar ahora
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </a>
    </div>
  );
}
