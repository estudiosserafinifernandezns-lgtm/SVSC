import { useState } from 'react';
import { ArrowLeft, Send, HelpCircle, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface CommunityScreenProps {
  onBack: () => void;
}

interface SuggestionForm {
  author: string;
  quote: string;
  rival: string;
  source: string;
  nickname: string;
  company: string; // honeypot — must stay empty
}

const EMPTY_FORM: SuggestionForm = {
  author: '',
  quote: '',
  rival: '',
  source: '',
  nickname: '',
  company: '',
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function CommunityScreen({ onBack }: CommunityScreenProps) {
  const [form, setForm] = useState<SuggestionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof SuggestionForm, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  const updateField = (field: keyof SuggestionForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof SuggestionForm, string>> = {};
    const author = form.author.trim();
    const rival = form.rival.trim();
    const quote = form.quote.trim();

    if (!author) next.author = 'Decinos quién dijo la frase.';
    if (!quote) next.quote = 'Escribí la frase que querés sugerir.';
    if (!rival) next.rival = 'Elegí un rival para el enfrentamiento.';
    if (author && rival && author.toLowerCase() === rival.toLowerCase()) {
      next.rival = 'El autor y el rival no pueden ser la misma persona.';
    }
    if (form.source && !/^https?:\/\/.+/i.test(form.source.trim())) {
      next.source = 'La fuente debe ser un enlace http/https válido.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (form.company.trim() !== '') {
      // Honeypot triggered — silently drop.
      setStatus('success');
      setForm(EMPTY_FORM);
      return;
    }
    setStatus('loading');
    setSubmitError('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error');
      setSubmitError('El servicio de correo no está configurado.');
      return;
    }

    const params = {
      autor: form.author.trim(),
      frase: form.quote.trim(),
      rival: form.rival.trim(),
      fuente: form.source.trim() || 'No indicada',
      apodo: form.nickname.trim() || 'Anónimo',
    };

    try {
      const response = await emailjs.send(serviceId, templateId, params, { publicKey });
      if (response && response.status === 200) {
        setStatus('success');
        setForm(EMPTY_FORM);
      } else {
        setStatus('error');
        setSubmitError('EmailJS no confirmó el envío. Intentá de nuevo.');
      }
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'No se pudo enviar la sugerencia.';
      setSubmitError(`Error de envío: ${message}`);
    }
  };

  const authorPreview = form.author.trim();
  const rivalPreview = form.rival.trim();
  const quotePreview = form.quote.trim();

  const inputClass = (hasError?: string) =>
    `w-full bg-white border-2 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-300 outline-none transition-colors text-sm font-medium ${
      hasError
        ? 'border-[var(--color-red)] focus:border-[var(--color-red)]'
        : 'border-gray-200 focus:border-[var(--color-purple)]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] scanlines">
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-ink)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[var(--color-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-pixel">Volver</span>
          </button>
          <h2 className="text-base sm:text-lg font-display text-[var(--color-ink)] flex items-center gap-2 ml-auto">
            <Users className="w-5 h-5 text-[var(--color-purple)]" />
            COMUNIDAD
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-md bg-[var(--color-red)]/10 border-2 border-[var(--color-red)]/30 flex items-center justify-center">
              <Silhouette className="text-[var(--color-red)]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] flex items-center justify-center shadow-arcade-sm vs-pulse">
              <HelpCircle className="w-4 h-4 text-[var(--color-ink)]" strokeWidth={3} />
            </div>
            <div className="w-12 h-12 rounded-md bg-[var(--color-purple)]/10 border-2 border-[var(--color-purple)]/30 flex items-center justify-center">
              <Silhouette className="text-[var(--color-purple)]" />
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-2" style={{ textShadow: '2px 2px 0 var(--color-purple-dark)' }}>
            LA COMUNIDAD TAMBIÉN JUEGA
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            ¿Tenés una frase que haría dudar hasta a Einstein? Mandanos tu versus y capaz aparece en la próxima actualización.
          </p>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="bg-white border-2 border-green-400 rounded-lg p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-500" strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-2xl text-green-600 mb-2" style={{ textShadow: '2px 2px 0 rgba(34,197,94,0.15)' }}>
              ¡VERSUS ENVIADO!
            </h2>
            <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Tu idea ya está en camino. Capaz la próxima frase que aparezca en el juego sea la tuya.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setForm(EMPTY_FORM);
              }}
              className="mt-5 inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-4 py-2 border-2 border-[var(--color-purple)]/30 transition-colors"
            >
              Enviar otro versus
            </button>
          </div>
        ) : (
          <>
            {/* Live preview */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-5 animate-in fade-in duration-500">
              <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider mb-3 text-center">
                Vista previa del versus
              </p>

              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="flex-1 max-w-[40%]">
                  <div className="aspect-square rounded-md bg-[var(--color-red)]/8 border-2 border-dashed border-[var(--color-red)]/40 flex items-center justify-center mb-2 overflow-hidden">
                    <span className="font-display text-2xl sm:text-3xl text-[var(--color-red)]/80 text-center px-2 truncate">
                      {authorPreview || '?'}
                    </span>
                  </div>
                  <p className="text-center text-xs font-bold text-gray-700 truncate">
                    {authorPreview || 'Personaje A'}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] flex items-center justify-center shadow-arcade-sm vs-pulse">
                    <span className="font-display text-xs sm:text-sm text-[var(--color-ink)]">VS</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[40%]">
                  <div className="aspect-square rounded-md bg-[var(--color-purple)]/8 border-2 border-dashed border-[var(--color-purple)]/40 flex items-center justify-center mb-2 overflow-hidden">
                    <span className="font-display text-2xl sm:text-3xl text-[var(--color-purple)]/80 text-center px-2 truncate">
                      {rivalPreview || '?'}
                    </span>
                  </div>
                  <p className="text-center text-xs font-bold text-gray-700 truncate">
                    {rivalPreview || 'Personaje B'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center min-h-[3rem]">
                <span className="font-display text-2xl text-[var(--color-yellow)]/40 select-none leading-none align-top mr-1">&ldquo;</span>
                <p className={`inline text-sm sm:text-base font-semibold text-gray-700 leading-relaxed ${quotePreview ? '' : 'text-gray-300 italic'}`}>
                  {quotePreview || 'La frase que sugieras aparecerá acá'}
                </p>
                <span className="font-display text-2xl text-[var(--color-yellow)]/40 select-none leading-none align-top ml-1">&rdquo;</span>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Honeypot — hidden from real users via CSS + aria-hidden */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label>Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
                  Personaje que dijo la frase
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => updateField('author', e.target.value.slice(0, 60))}
                  placeholder="Ej: Ibai Llanos"
                  className={inputClass(errors.author)}
                />
                {errors.author && <p className="text-xs text-[var(--color-red)] font-medium mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
                  Frase exacta
                </label>
                <textarea
                  value={form.quote}
                  onChange={(e) => updateField('quote', e.target.value.slice(0, 500))}
                  placeholder="Escribí la frase tal cual la dijo"
                  rows={3}
                  className={`${inputClass(errors.quote)} resize-none`}
                />
                <div className="flex justify-between mt-1">
                  {errors.quote ? (
                    <p className="text-xs text-[var(--color-red)] font-medium">{errors.quote}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[10px] text-gray-300 font-pixel tabular-nums">{form.quote.length}/500</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
                  Personaje rival
                </label>
                <input
                  type="text"
                  value={form.rival}
                  onChange={(e) => updateField('rival', e.target.value.slice(0, 60))}
                  placeholder="Ej: Albert Einstein"
                  className={inputClass(errors.rival)}
                />
                {errors.rival && <p className="text-xs text-[var(--color-red)] font-medium mt-1">{errors.rival}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
                  Fuente de la frase <span className="text-gray-300 normal-case">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={form.source}
                  onChange={(e) => updateField('source', e.target.value.slice(0, 300))}
                  placeholder="https://video, entrevista o artículo"
                  className={inputClass(errors.source)}
                />
                {errors.source ? (
                  <p className="text-xs text-[var(--color-red)] font-medium mt-1">{errors.source}</p>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Si tenés el video o la publicación original, mejor todavía. Nos ayuda a comprobar que la frase sea auténtica.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
                  Tu nombre o apodo <span className="text-gray-300 normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => updateField('nickname', e.target.value.slice(0, 20))}
                  placeholder="Anónimo"
                  className={inputClass()}
                />
              </div>
            </div>

            {/* Error banner */}
            {status === 'error' && submitError && (
              <div className="mt-4 bg-red-50 border-2 border-[var(--color-red)]/40 rounded-lg px-4 py-3 flex items-start gap-2.5 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-4 h-4 text-[var(--color-red)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--color-red-dark)] font-medium leading-relaxed">{submitError}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-display text-base rounded-lg px-6 py-3.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade border-2 border-[var(--color-ink)] disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100 animate-in fade-in duration-500"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ENVIANDO...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ENVIAR VERSUS
                </>
              )}
            </button>

            {/* Closing message */}
            <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed max-w-md mx-auto italic">
             
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Silhouette({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-4.4 0-8 2.7-8 6v1h16v-1c0-3.3-3.6-6-8-6z" />
    </svg>
  );
}
