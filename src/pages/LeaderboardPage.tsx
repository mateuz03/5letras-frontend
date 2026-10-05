import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';

interface Leader {
  _id: string;
  name: string;
  points: number;
}

function rankStyle(index: number) {
  if (index === 0) return 'bg-gradient-to-r from-yellow-500/30 to-yellow-700/20 border-yellow-500/60 text-yellow-100';
  if (index === 1) return 'bg-gradient-to-r from-slate-300/30 to-slate-400/20 border-slate-300/50 text-slate-100';
  if (index === 2) return 'bg-gradient-to-r from-amber-600/30 to-amber-800/20 border-amber-600/50 text-amber-100';
  return 'bg-wine-850/80 border-rosegold/25 text-champagne';
}

export function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<Leader[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Leader[]>('/api/users/leaderboard', { auth: false })
      .then(setLeaders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar ranking.'));
  }, []);

  const myRank = user && leaders
    ? leaders.findIndex((l) => l._id === user.id)
    : -1;

  return (
    <PageShell>
      <PageTitle title="Ranking" subtitle="Os hóspedes mais apaixonados do 5 Letras." />

      {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

      {leaders === null && !error && (
        <div className="space-y-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-[20px] bg-wine-850/70" />
          ))}
        </div>
      )}

      {leaders !== null && (
        <ul className="space-y-3">
          {leaders.map((leader, i) => {
            const isMe = user?.id === leader._id;
            return (
              <motion.li
                key={leader._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <div
                  className={`flex items-center gap-4 rounded-[20px] border px-4 py-3.5 ${rankStyle(i)} ${
                    isMe ? 'ring-1 ring-rosegold/70' : ''
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm ${
                      i < 3 ? 'bg-white/10 text-current' : 'bg-wine-900/60 text-champagne/70'
                    }`}
                  >
                    {i + 1}º
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-current">
                      {leader.name}
                      {isMe && <span className="ml-2 text-[10px] tracking-[0.2em] text-rosegold-soft uppercase">Você</span>}
                    </p>
                    <p className="text-xs font-light text-current/70">
                      {leader.points.toLocaleString('pt-BR')} pts
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}

      {user && myRank >= 0 && (
        <div className="mt-8 rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5 text-center">
          <p className="text-[10px] tracking-[0.32em] text-champagne/50 uppercase">Sua colocação</p>
          <p className="mt-1 font-display text-3xl text-champagne">{myRank + 1}º</p>
          <p className="mt-0.5 text-xs font-light text-champagne/60">lugar no ranking</p>
        </div>
      )}
    </PageShell>
  );
}
