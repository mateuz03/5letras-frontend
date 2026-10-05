import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';
import { formatPrice } from '@/data/suites';

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

export function ReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { pointsEarned?: number; reviewSent?: boolean } | null;
    if (state?.pointsEarned) {
      setToast(`Reserva confirmada! Você ganhou ${state.pointsEarned} pontos.`);
      window.history.replaceState({}, '');
      const t = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(t);
    }
    if (state?.reviewSent) {
      setToast('Obrigado! Sua avaliação foi enviada.');
      window.history.replaceState({}, '');
      const t = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  async function load() {
    try {
      const [res, rev] = await Promise.all([
        api<Reservation[]>('/api/reservations/my-reservations'),
        api<Review[]>('/api/reviews/my-reviews'),
      ]);
      setReservations(res);
      setReviews(rev);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar reservas.');
    }
  }

  useEffect(() => {
    if (!authLoading && user) void load();
    else if (!authLoading) setReservations([]);
  }, [user, authLoading]);

  function podeAvaliar(r: Reservation) {
    if (r.status === 'Cancelada') return false;
    if (!r.checkIn) return false;
    const checkIn = new Date(r.checkIn);
    const agora = new Date();
    const jaAvaliou = reviews.some((rev) => rev.reservation === r._id);
    return checkIn < agora && !jaAvaliou;
  }

  function avaliar(r: Reservation) {
    const motel = typeof r.motel === 'string' ? { _id: r.motel, name: 'Motel' } : r.motel;
    navigate('/avaliar', {
      state: {
        reservationId: r._id,
        motelId: motel._id,
        motelName: motel.name,
        suiteName: r.suite?.name ?? 'Suíte',
      },
    });
  }

  async function cancelar(id: string) {
    try {
      await api(`/api/reservations/${id}/cancel`, { method: 'PATCH' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar.');
    }
  }

  if (authLoading) {
    return (
      <PageShell>
        <div className="mt-8 h-40 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <PageTitle title="Suas reservas" />
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">
            Entre na sua conta para ver
            <br />
            e gerenciar suas reservas.
          </p>
          <Link
            to="/login?redirect=/reservas"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-rosegold px-8 text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft"
          >
            Entrar
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle title="Suas reservas" subtitle="Momentos guardados com carinho." />

      {error && <p className="mb-4 rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

      {reservations === null && <div className="h-40 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />}

      {reservations?.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">
            Nenhuma reserva ainda.
            <br />
            Sua próxima noite inesquecível espera por você.
          </p>
          <Link to="/buscar" className="mt-6 inline-block text-xs tracking-[0.28em] text-rosegold uppercase hover:text-rosegold-soft">
            Explorar suítes
          </Link>
        </div>
      )}

      <ul className="space-y-4">
        {reservations?.map((r) => (
          <li key={r._id} className="rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.42em] text-rosegold-soft uppercase">Suíte {r.suite?.name}</p>
                <p className="mt-1 font-display text-lg text-champagne">{r.period?.label}</p>
                {r.checkIn && (
                  <p className="mt-0.5 text-xs font-light text-rosegold-soft">
                    Check-in:{' '}
                    {new Date(r.checkIn).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })}
                  </p>
                )}
                <p className="mt-0.5 text-xs font-light text-champagne/50">
                  {new Date(r.bookingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl text-champagne">R$ {formatPrice(r.total)}</p>
                <span
                  className={`mt-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase ${
                    r.status === 'Cancelada'
                      ? 'border-champagne/30 text-champagne/50'
                      : 'border-rosegold/50 text-rosegold-soft'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {podeAvaliar(r) && (
                <button
                  type="button"
                  onClick={() => avaliar(r)}
                  className="min-h-[40px] w-full rounded-xl bg-rosegold text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne"
                >
                  Avaliar estadia
                </button>
              )}
              {r.status === 'Confirmada' && (
                <button
                  type="button"
                  onClick={() => cancelar(r._id)}
                  className="min-h-[40px] w-full rounded-xl border border-rosegold/40 text-xs tracking-[0.24em] text-rosegold uppercase transition-colors duration-300 hover:bg-wine-800 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
                >
                  Cancelar reserva
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[85%] rounded-full border border-rosegold/40 bg-wine-800/95 px-5 py-2.5 text-center text-sm text-champagne shadow-lg backdrop-blur-md">
          {toast}
        </div>
      )}
    </PageShell>
  );
}
