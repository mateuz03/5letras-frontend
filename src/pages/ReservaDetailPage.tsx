import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';
import { formatPrice } from '@/data/suites';
import { StarIcon, ChevronRightIcon } from '@/icons';

interface Reservation {
  _id: string;
  motel: { _id: string; name: string; location: string; image?: string } | string;
  suite: { name: string };
  period: { label: string; price: number };
  total: number;
  status: string;
  bookingDate: string;
  checkIn?: string;
}

interface Review {
  _id: string;
  reservation?: string;
}

const CHECKIN_HOUR = '14:00';

function StatusBadge({ status }: { status: string }) {
  const style =
    status === 'Cancelada'
      ? 'border-champagne/30 text-champagne/50'
      : status === 'Finalizada'
        ? 'border-champagne/50 text-champagne/80'
        : 'border-rosegold/50 text-rosegold-soft';
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase ${style}`}>
      {status}
    </span>
  );
}

export function ReservaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [res, rev] = await Promise.all([
        api<Reservation>(`/api/reservations/${id}`),
        api<Review[]>('/api/reviews/my-reviews'),
      ]);
      setReservation(res);
      setReviews(rev);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar reserva.');
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && user) void load();
  }, [user, authLoading, load]);

  useEffect(() => {
    const state = location.state as { reviewSent?: boolean } | null;
    if (state?.reviewSent) {
      void load();
      setToast('Obrigado! Sua avaliação foi enviada.');
      window.history.replaceState({}, '');
      const t = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(t);
    }
  }, [location.state, load]);

  if (authLoading) {
    return (
      <PageShell>
        <div className="mt-8 h-64 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <PageTitle title="Detalhe da reserva" />
        <p className="mt-6 text-center text-sm font-light text-champagne/60">Entre para ver sua reserva.</p>
        <Link
          to={`/login?redirect=/reservas/${id}`}
          className="mt-6 mx-auto flex min-h-[44px] w-fit items-center rounded-xl bg-rosegold px-8 text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft"
        >
          Entrar
        </Link>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <PageTitle title="Detalhe da reserva" />
        <p className="mt-6 rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>
        <Link to="/reservas" className="mt-6 inline-block text-xs tracking-[0.28em] text-rosegold uppercase hover:text-rosegold-soft">
          Voltar para reservas
        </Link>
      </PageShell>
    );
  }

  if (!reservation) {
    return (
      <PageShell>
        <div className="mt-8 h-64 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />
      </PageShell>
    );
  }

  const motel = typeof reservation.motel === 'string' ? null : reservation.motel;
  const jaAvaliou = reviews.some((rev) => rev.reservation === reservation._id);
  const checkInPassado = reservation.checkIn ? new Date(reservation.checkIn) < new Date() : false;
  const podeAvaliar = reservation.status !== 'Cancelada' && checkInPassado && !jaAvaliou;

  function avaliar() {
    navigate('/avaliar', {
      state: {
        reservationId: reservation!._id,
        motelId: motel?._id ?? '',
        motelName: motel?.name ?? 'Motel',
        suiteName: reservation!.suite?.name ?? 'Suíte',
        returnTo: `/reservas/${reservation!._id}`,
      },
    });
  }

  async function cancelar() {
    setBusy(true);
    try {
      await api(`/api/reservations/${reservation!._id}/cancel`, { method: 'PATCH' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => navigate('/reservas')}
        className="mb-2 text-xs tracking-[0.24em] text-rosegold uppercase hover:text-rosegold-soft focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
      >
        ← Reservas
      </button>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-[24px] border border-rosegold/25 bg-wine-850/80"
      >
        <div className="relative h-40 bg-[radial-gradient(100%_100%_at_70%_20%,#4d2739,#22141d)]">
          {motel?.image && (
            <img
              src={motel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(28,17,25,0.92)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div>
              <h2 className="font-display text-2xl text-champagne">{motel?.name ?? 'Motel'}</h2>
              <p className="text-xs font-light text-champagne/60">{motel?.location}</p>
            </div>
            <StatusBadge status={reservation.status} />
          </div>
        </div>

        <dl className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[10px] tracking-[0.28em] text-champagne/50 uppercase">Suíte</dt>
            <dd className="font-display text-lg text-champagne">{reservation.suite?.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[10px] tracking-[0.28em] text-champagne/50 uppercase">Período</dt>
            <dd className="text-sm text-champagne">
              {reservation.period?.label}
              <span className="ml-2 text-champagne/55">R$ {formatPrice(reservation.period?.price ?? 0)}</span>
            </dd>
          </div>
          {reservation.checkIn && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] tracking-[0.28em] text-champagne/50 uppercase">Check-in</dt>
              <dd className="text-sm text-rosegold-soft">
                {new Date(reservation.checkIn).toLocaleString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[10px] tracking-[0.28em] text-champagne/50 uppercase">Reservado em</dt>
            <dd className="text-sm text-champagne/80">
              {new Date(reservation.bookingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-rosegold/20 pt-4">
            <dt className="text-[10px] tracking-[0.28em] text-rosegold-soft uppercase">Total</dt>
            <dd className="font-display text-2xl text-champagne">R$ {formatPrice(reservation.total)}</dd>
          </div>
        </dl>
      </motion.div>

      <p className="mt-3 text-center text-[11px] font-light text-champagne/45">
        Horário de check-in previsto: {CHECKIN_HOUR}
      </p>

      <div className="mt-6 space-y-2">
        {motel && (
          <Link
            to={`/motel/${motel._id}`}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-rosegold/35 text-xs tracking-[0.24em] text-champagne uppercase transition-colors duration-300 hover:bg-wine-850 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
          >
            Ver motel <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />
          </Link>
        )}
        {podeAvaliar && (
          <button
            type="button"
            onClick={avaliar}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-rosegold text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne"
          >
            <StarIcon className="h-3.5 w-3.5" /> Avaliar estadia
          </button>
        )}
        {jaAvaliou && (
          <p className="text-center text-xs font-light text-champagne/50">Você já avaliou esta estadia. Obrigado!</p>
        )}
        {reservation.status === 'Confirmada' && (
          <button
            type="button"
            onClick={cancelar}
            disabled={busy}
            className="min-h-[44px] w-full rounded-xl border border-rosegold/40 text-xs tracking-[0.24em] text-rosegold uppercase transition-colors duration-300 hover:bg-wine-800 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold disabled:opacity-50"
          >
            {busy ? 'Cancelando…' : 'Cancelar reserva'}
          </button>
        )}
      </div>

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[85%] rounded-full border border-rosegold/40 bg-wine-800/95 px-5 py-2.5 text-center text-sm text-champagne shadow-lg backdrop-blur-md">
          {toast}
        </div>
      )}
    </PageShell>
  );
}
