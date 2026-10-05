import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';
import { StarIcon } from '@/icons';

interface ReviewState {
  reservationId: string;
  motelId: string;
  motelName: string;
  suiteName: string;
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Nota">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${star} estrelas`}
          aria-pressed={value === star}
          className={`h-10 w-10 transition-transform duration-200 hover:scale-110 focus:outline-none ${
            star <= (hover || value) ? 'text-rosegold' : 'text-champagne/25'
          }`}
        >
          <StarIcon className="h-full w-full" />
        </button>
      ))}
    </div>
  );
}

export function AvaliarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = (location.state as ReviewState | null) ?? null;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !state) {
    return (
      <PageShell>
        <PageTitle title="Avaliar estadia" />
        <p className="mt-6 text-center text-sm font-light text-champagne/60">
          Escolha uma reserva finalizada na tela de reservas para avaliar.
        </p>
      </PageShell>
    );
  }

  const reviewState = state;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Escreva um comentário sobre sua experiência.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api('/api/reviews', {
        method: 'POST',
        body: {
          motelId: reviewState.motelId,
          rating,
          comment: comment.trim(),
          reservationId: reviewState.reservationId,
          suiteName: reviewState.suiteName,
        },
      });
      navigate('/reservas', { state: { reviewSent: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar avaliação.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <PageTitle title="Avaliar estadia" subtitle={`Conte como foi sua experiência na ${reviewState.motelName}.`} />

      <form onSubmit={enviar} className="space-y-6">
        <div className="rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5">
          <p className="text-[10px] tracking-[0.42em] text-rosegold-soft uppercase">Suíte</p>
          <p className="mt-1 font-display text-xl text-champagne">{reviewState.suiteName}</p>
        </div>

        <fieldset className="rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5">
          <legend className="text-[10px] tracking-[0.3em] text-champagne/50 uppercase">Nota</legend>
          <div className="mt-2">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </fieldset>

        <label className="block rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5">
          <span className="mb-2 block text-[10px] tracking-[0.3em] text-champagne/50 uppercase">Comentário</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="O que você mais gostou?"
            rows={5}
            maxLength={1000}
            className="mt-2 w-full resize-none bg-transparent text-sm font-light leading-relaxed text-champagne placeholder:text-champagne/40 focus:outline-none"
          />
          <p className="mt-2 text-right text-[10px] text-champagne/40">{comment.length}/1000</p>
        </label>

        {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={busy}
            className="min-h-[48px] flex-1 rounded-xl border border-rosegold/40 text-xs tracking-[0.24em] text-rosegold uppercase transition-colors duration-300 hover:bg-wine-800 disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={busy}
            className="min-h-[48px] flex-1 rounded-xl bg-rosegold text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft disabled:opacity-50"
          >
            {busy ? 'Enviando…' : 'Enviar avaliação'}
          </button>
        </div>
      </form>
    </PageShell>
  );
}
