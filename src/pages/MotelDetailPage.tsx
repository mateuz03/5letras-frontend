import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, Toast } from '@/sections/Layout';
import { StarIcon, ChevronRightIcon, HeartIcon } from '@/icons';
import { formatPrice } from '@/data/suites';

interface Motel {
  _id: string;
  name: string;
  location: string;
  rating: number;
  description?: string;
  price?: string;
  categories?: string[];
  suites?: { name: string; price: number; amenities?: string[] }[];
}

const PERIODS = [
  { label: '4 horas', multiplier: 1 },
  { label: '6 horas', multiplier: 1.5 },
  { label: '12 horas', multiplier: 2.2 },
];

export function MotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  const [motel, setMotel] = useState<Motel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(PERIODS[0].label);
  const [toast, setToast] = useState<string | null>(null);
  const favorited = user?.favorites.includes(id ?? '') ?? false;

  useEffect(() => {
    api<{ motels: Motel[] }>(`/api/motels?limit=50`, { auth: false })
      .then((res) => {
        const found = res.motels.find((m) => m._id === id);
        if (!found) throw new Error('Motel não encontrado.');
        setMotel(found);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar motel.'));
  }, [id]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }

  async function favoritar() {
    if (!user) {
      navigate(`/login?redirect=/motel/${id}`);
      return;
    }
    try {
      await toggleFavorite(id ?? '');
    } catch {
      showToast('Não foi possível atualizar os favoritos.');
    }
  }

  async function reservar(suiteName: string, basePrice: number) {
    if (!user) {
      navigate(`/login?redirect=/motel/${id}`);
      return;
    }
    if (!motel) return;
    const chosen = PERIODS.find((p) => p.label === period) ?? PERIODS[0];
    const price = Math.round(basePrice * chosen.multiplier);
    try {
      await api('/api/reservations', {
        method: 'POST',
        body: {
          motel: motel._id,
          suite: { suiteId: suiteName, name: suiteName },
          period: { label: chosen.label, price },
          addons: [],
          total: price,
        },
      });
      navigate('/reservas');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao reservar.');
    }
  }

  if (error) {
    return (
      <PageShell>
        <p className="mt-16 text-center text-sm font-light text-champagne/60">{error}</p>
        <div className="mt-4 text-center">
          <Link to="/buscar" className="text-xs tracking-[0.28em] text-rosegold uppercase">Voltar à busca</Link>
        </div>
      </PageShell>
    );
  }

  if (!motel) {
    return (
      <PageShell>
        <div className="mt-8 h-64 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="relative -mx-5 mb-5 h-56 overflow-hidden bg-[radial-gradient(110%_90%_at_75%_15%,#4d2739_0%,#2a1520_45%,#170d14_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(35%_25%_at_70%_35%,rgba(217,138,126,0.45),transparent_70%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,#1c1119_100%)]" aria-hidden="true" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/40 bg-wine-900/60 text-champagne backdrop-blur-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
          aria-label="Voltar"
        >
          <ChevronRightIcon className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={favoritar}
          aria-label={`Favoritar ${motel.name}`}
          aria-pressed={favorited}
          className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-rosegold/40 bg-wine-900/60 backdrop-blur-sm transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
            favorited ? 'text-rosegold' : 'text-champagne'
          }`}
        >
          <HeartIcon className="h-5 w-5" filled={favorited} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-3xl text-champagne">{motel.name}</h1>
          <span className="mt-1 flex shrink-0 items-center gap-1 rounded-full border border-rosegold/40 px-2.5 py-1 text-sm text-rosegold-soft">
            <StarIcon className="h-3.5 w-3.5" />
            {(motel.rating ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
          </span>
        </div>
        <p className="mt-1 text-sm font-light text-champagne/60">{motel.location}</p>
        {motel.categories && motel.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {motel.categories.map((c) => (
              <span key={c} className="rounded-full border border-rosegold/30 px-3 py-1 text-[10px] tracking-[0.2em] text-champagne/70 uppercase">
                {c}
              </span>
            ))}
          </div>
        )}
        {motel.description && <p className="mt-4 text-sm font-light leading-relaxed text-champagne/70">{motel.description}</p>}
      </motion.div>

      <h2 className="mt-8 text-xs font-normal tracking-[0.38em] text-rosegold uppercase">Suítes disponíveis</h2>

      <ul className="mt-4 space-y-4">
        {motel.suites?.map((suite, i) => {
          const chosen = PERIODS.find((p) => p.label === period) ?? PERIODS[0];
          return (
            <motion.li
              key={`${suite.name}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="rounded-[20px] border border-rosegold/25 bg-wine-850/80 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.42em] text-rosegold-soft uppercase">Suíte</p>
                  <h3 className="mt-0.5 font-display text-2xl italic text-champagne">{suite.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-[0.3em] text-champagne/50 uppercase">A partir de</p>
                  <p className="mt-0.5 font-display text-xl text-champagne">R$ {formatPrice(suite.price)}</p>
                </div>
              </div>
              {suite.amenities && suite.amenities.length > 0 && (
                <p className="mt-2 text-xs font-light text-champagne/55">{suite.amenities.join(' · ')}</p>
              )}

              <fieldset className="mt-4">
                <legend className="text-[10px] tracking-[0.3em] text-champagne/50 uppercase">Período</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {PERIODS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setPeriod(p.label)}
                      aria-pressed={period === p.label}
                      className={`min-h-[40px] rounded-lg border text-xs tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
                        period === p.label
                          ? 'border-rosegold bg-rosegold/15 text-rosegold-soft'
                          : 'border-rosegold/25 text-champagne/60 hover:border-rosegold/50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-4 flex items-center justify-between border-t border-rosegold/20 pt-3.5">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-champagne/50 uppercase">Total · {chosen.label}</p>
                  <p className="font-display text-lg text-champagne">R$ {formatPrice(Math.round(suite.price * chosen.multiplier))}</p>
                </div>
                <button
                  type="button"
                  onClick={() => reservar(suite.name, suite.price)}
                  className="min-h-[44px] rounded-xl bg-rosegold px-6 text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-all duration-300 hover:bg-rosegold-soft focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne"
                >
                  Reservar
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <Toast message={toast} />
    </PageShell>
  );
}
