import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';

interface Reward {
  _id: string;
  title: string;
  description: string;
  points: number;
}

interface Redemption {
  _id: string;
  reward: { title: string } | string;
  pointsSpent: number;
  redeemedAt: string;
}

export function RecompensasPage() {
  const { user, refresh } = useAuth();
  const [rewards, setRewards] = useState<Reward[] | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Reward[]>('/api/rewards', { auth: false })
      .then(setRewards)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar privilégios.'));
  }, []);

  useEffect(() => {
    if (user) {
      api<Redemption[]>('/api/rewards/my-redemptions')
        .then(setRedemptions)
        .catch(() => setRedemptions([]));
    }
  }, [user]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  async function resgatar(reward: Reward) {
    if (!user) {
      showToast('Entre na sua conta para resgatar.');
      return;
    }
    try {
      const res = await api<{ newPoints: number }>(`/api/rewards/redeem/${reward._id}`, { method: 'POST' });
      showToast(`Privilégio resgatado! Você tem ${res.newPoints} pontos.`);
      await refresh();
      const list = await api<Redemption[]>('/api/rewards/my-redemptions');
      setRedemptions(list);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao resgatar.');
    }
  }

  return (
    <PageShell>
      <PageTitle title="Seus privilégios" subtitle="Cada estadia vale uma recompensa." />

      {user && (
        <div className="mb-6 flex items-center justify-between rounded-[20px] border border-rosegold/30 bg-wine-850/80 px-5 py-4">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-champagne/50 uppercase">Saldo de pontos</p>
            <p className="mt-0.5 font-display text-2xl text-champagne">{user.points.toLocaleString('pt-BR')}</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-rosegold/40 font-display text-lg text-rosegold">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

      {rewards === null && !error && <div className="h-48 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />}

      {rewards?.length === 0 && <p className="mt-8 text-center text-sm font-light text-champagne/50">Nenhum privilégio disponível no momento.</p>}

      <ul className="space-y-4">
        {rewards?.map((reward) => {
          const suficiente = (user?.points ?? 0) >= reward.points;
          return (
            <li key={reward._id} className="rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-display text-xl text-champagne">{reward.title}</h3>
                  <p className="mt-1 text-sm font-light text-champagne/60">{reward.description}</p>
                </div>
                <span className="shrink-0 rounded-full border border-rosegold/40 px-3 py-1 text-xs text-rosegold-soft">
                  {reward.points} pts
                </span>
              </div>
              <button
                type="button"
                onClick={() => resgatar(reward)}
                disabled={!user || !suficiente}
                className={`mt-4 min-h-[44px] w-full rounded-xl text-xs font-normal tracking-[0.24em] uppercase transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne ${
                  user && suficiente
                    ? 'bg-rosegold text-wine-950 hover:bg-rosegold-soft'
                    : 'cursor-not-allowed border border-champagne/25 text-champagne/40'
                }`}
              >
                {!user ? 'Entre para resgatar' : suficiente ? 'Resgatar' : `Faltam ${reward.points - (user?.points ?? 0)} pts`}
              </button>
            </li>
          );
        })}
      </ul>

      {user && redemptions.length > 0 && (
        <>
          <h2 className="mt-9 text-xs font-normal tracking-[0.38em] text-rosegold uppercase">Seus resgates</h2>
          <ul className="mt-4 space-y-2.5">
            {redemptions.map((r) => {
              const title = typeof r.reward === 'string' ? 'Privilégio' : r.reward.title;
              return (
                <li key={r._id} className="flex items-center justify-between rounded-xl border border-rosegold/15 bg-wine-850/50 px-4 py-3">
                  <span className="text-sm font-light text-champagne/80">{title}</span>
                  <span className="text-xs text-champagne/45">
                    {new Date(r.redeemedAt).toLocaleDateString('pt-BR')} · −{r.pointsSpent} pts
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {!user && (
        <p className="mt-8 text-center text-sm font-light text-champagne/50">
          <Link to="/login?redirect=/recompensas" className="text-rosegold hover:text-rosegold-soft">
            Entre na sua conta
          </Link>{' '}
          para acumular e resgatar pontos.
        </p>
      )}

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[85%] rounded-full border border-rosegold/40 bg-wine-800/95 px-5 py-2.5 text-center text-sm text-champagne shadow-lg backdrop-blur-md">
          {toast}
        </div>
      )}
    </PageShell>
  );
}
