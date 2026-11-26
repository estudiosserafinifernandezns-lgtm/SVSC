
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Heart,
  Instagram,
  Maximize2,
  X,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { copyToClipboard } from '@/lib/game';

const QR_IMAGE_URL = '/images/image.png';

interface BinanceQrProps {
  className?: string;
}

function BinanceQr({ className = '' }: BinanceQrProps) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-xl bg-white ${className}`}
    >
      <img
        src={QR_IMAGE_URL}
        alt="Código QR de Binance Pay a nombre de Nicolas Serafini"
        className="absolute max-w-none"
        style={{
          width: '156.5%',
          left: '-28.4%',
          top: '-66.3%',
        }}
      />
    </div>
  );
}

interface SupportScreenProps {
  onBack: () => void;
}

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [copied, setCopied] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!zoomOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomOpen]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(siteConfig.binancePayId);

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] scanlines">
      {/* Barra superior */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-ink)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[var(--color-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-pixel">Volver</span>
          </button>

          <h2 className="text-base sm:text-lg font-display text-[var(--color-ink)] flex items-center gap-2 ml-auto">
            <Heart className="w-5 h-5 text-[var(--color-red)] fill-current" />
            DONACIONES
          </h2>
        </div>
      </div>

      {/* Sección principal */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-[55fr_45fr] overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] bg-white shadow-arcade">

          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col justify-center p-6 sm:p-8 text-center md:text-left">
            <h1 className="font-display text-lg sm:text-xl leading-[1.2] text-[var(--color-ink)]">
              ¿TE GUSTÓ EL JUEGO? APOYÁ EL PROYECTO ❤️
            </h1>

            
<p className="mt-3 text-sm leading-relaxed text-gray-600">
  Si te gustó el juego y querés apoyar, cualquier aporte ayuda
  a pagar los dominios, mantener los juegos online y seguir
  creando nuevos proyectos. Prefiero no poner anuncios para
  que puedas jugar sin interrupciones, así que tu apoyo
  significa mucho. ¡Gracias por bancar estas ideas!
</p>


            {/* Vandal Prime */}
            <div className="mt-5 rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] p-4">
              <p className="font-display text-xs text-[var(--color-ink)]">
                Objetivo secundario: Vandal Prime 😉
              </p>

              <p className="mt-2 text-sm italic leading-relaxed text-[var(--color-purple)]">
                Tené en cuenta mi sinceridad JAJA.
              </p>

              <img
                src="/images/prime.gif"
                alt="Vandal Prime animada de VALORANT"
                className="mt-4 w-full max-w-[350px] mx-auto rounded-xl object-contain"
                loading="lazy"
              />
            </div>

            {siteConfig.instagramHandle && (
              <a
                href={`https://instagram.com/${siteConfig.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-3 font-pixel text-xs text-[var(--color-ink)] shadow-arcade-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-purple)] hover:text-white active:translate-y-0 sm:w-auto sm:self-start md:self-auto"
              >
                <Instagram className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                mi ig 
              </a>
            )}
          </div>

          {/* COLUMNA DERECHA: BINANCE PAY */}
          <div className="flex flex-col items-center gap-4 bg-[#1E2329] p-6 sm:p-8 text-center text-white">
            <p className="text-[10px] font-pixel uppercase tracking-widest text-[#F0B90B]">
              Apoyá con Binance Pay
            </p>

            {/* Código QR */}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label="Ampliar código QR de Binance Pay"
              className="group relative w-full max-w-[200px] rounded-xl border border-[#F0B90B]/40 p-1.5 transition-all duration-300 hover:border-[#F0B90B] hover:shadow-[0_10px_24px_-8px_rgba(240,185,11,0.45)] active:scale-[0.98]"
            >
              <BinanceQr />

              <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1E2329]/85 text-[#F0B90B] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Binance Pay ID */}
            <div className="w-full rounded-xl border border-[#F0B90B]/30 bg-black/30 p-3">
              <p className="text-[10px] font-pixel uppercase tracking-widest text-[#F0B90B]">
                Binance Pay ID
              </p>

              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="font-mono text-base sm:text-lg tracking-wider tabular-nums">
                  {siteConfig.binancePayId}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#F0B90B] text-[#1E2329] hover:brightness-110'
                  }`}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}

                  {copied ? '¡Copiado!' : 'Copiar ID'}
                </button>
              </div>
            </div>

            {/* Instrucciones */}
            <p className="text-xs text-gray-400">
              Abrí Binance{' '}
              <span className="text-[#F0B90B]">→</span>{' '}
              Binance Pay{' '}
              <span className="text-[#F0B90B]">→</span>{' '}
              Escanear QR
            </p>

            {/* Descargar QR */}
            <a
              href={QR_IMAGE_URL}
              download="binance-pay-qr.png"
              className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 transition-colors hover:text-[#F0B90B]"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar imagen del QR
            </a>

            {/* Explicación sobre Paraguay y PayPal */}
            <div className="mt-3 w-full rounded-xl border border-[#F0B90B]/20 bg-black/20 p-4 text-left">
              <p className="text-xs leading-relaxed text-gray-300">
                Por ahora, Binance Pay es la única forma
                disponible para apoyar el proyecto. Varias
                plataformas de pago internacionales tienen
                limitaciones para quienes vivimos en Paraguay;
                por ejemplo, PayPal no permite recibir pagos
                convencionales en cuentas paraguayas.
                Por eso terminé optando por Binance.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Modal para ampliar QR */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Código QR ampliado"
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[min(85vw,420px)] animate-in zoom-in-95 duration-300"
          >
            <BinanceQr />
          </div>
        </div>
      )}
    </div>
  );
}
