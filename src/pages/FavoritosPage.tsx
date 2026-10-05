import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';
import { StarIcon, ChevronRightIcon, HeartIcon } from '@/icons';

interface Motel {
  _id: string;
  name: string;
  location: string;
  rating: number;
  image?: string;
  price?: string;
  categories?: string[];
  suites?: { name: string; price: number }[];
}

export function FavoritosPage() {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  const [motels, setMotels] = useState<Motel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    try {
      const res = await api<Motel[]>('/api/users/favorites');
      setMotels(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar favoritos.');
    }
  }

  useEffect(() => {
    if (user) void load();
    else setMotels([]);
  }, [user]);

  async function favoritar(motelId: string) {
    if (!user) {
      navigate('/login?redirect=/favoritos');
      return;
    }
    try {
      await toggleFavorite(motelId);
      await load();
    } catch {
      // silencioso
    }
  }

  if (!user) {
    return (
      <PageShell>
        <PageTitle title="Seus favoritos" />
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">
            Entre para guardar e rever
            <br />
            seus motéis preferidos.
          </p>
          <Link
            to="/login?redirect=/favoritos"
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
      <PageTitle title="Seus favoritos" subtitle="Os refúgios que conquistaram seu coração." />

      {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

      {motels === null && !error && (
        <div className="space-y-4" aria-hidden="true">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[20px] bg-wine-850/70" />
          ))}
        </div>
      )}

      {motels !== null && motels.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">
            Nenhum favorito ainda.
            <br />
            Toque no coração ao explorar os motéis.
          </p>
          <Link to="/buscar" className="mt-6 inline-block text-xs tracking-[0.28em] text-rosegold uppercase hover:text-rosegold-soft">
            Explorar motéis
          </Link>
        </div>
      )}

      <ul className="space-y-4">
        {motels?.map((motel, i) => (
          <motion.li
            key={motel._id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/motel/${motel._id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/motel/${motel._id}`);
                }
              }}
              className="group relative flex w-full cursor-pointer items-stretch overflow-hidden rounded-[20px] border border-rosegold/25 bg-wine-850/80 text-left transition-colors duration-300 hover:border-rosegold/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
            >
              <div className="relative w-28 shrink-0 bg-[radial-gradient(100%_100%_at_70%_20%,#4d2739,#22141d)]" aria-hidden="true">
                {motel.image && (
                  <img
                    src={motel.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_45%,rgba(217,138,126,0.4),transparent_75%)]" />
              </div>
              <button
                type="button"
                aria-label={`Remover ${motel.name} dos favoritos`}
                aria-pressed="true"
                onClick={(e) => {
                  e.stopPropagation();
                  favoritar(motel._id);
                }}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-wine-900/60 text-rosegold backdrop-blur-sm transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
              >
                <HeartIcon className="h-4.5 w-4.5" filled />
              </button>
              <div className="flex-1 px-4 py-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg leading-snug text-champagne">{motel.name}</h3>
                  <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full border border-rosegold/40 px-2 py-0.5 text-xs text-rosegold-soft">
                    <StarIcon className="h-3 w-3" />
                    {(motel.rating ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-light text-champagne/55">{motel.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-light text-champagne/70">
                    {motel.price ?? (motel.suites?.length ? `A partir de R$ ${Math.min(...motel.suites.map((s) => s.price))}` : '')}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-rosegold transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </PageShell>
  );
}
