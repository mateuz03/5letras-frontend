import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';
import { StarIcon, ChevronRightIcon, SearchIcon, HeartIcon } from '@/icons';

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

export function BuscarPage() {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  const [params] = useSearchParams();
  const [motels, setMotels] = useState<Motel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(params.get('q') ?? '');

  async function favoritar(motelId: string) {
    if (!user) {
      navigate('/login?redirect=/buscar');
      return;
    }
    try {
      await toggleFavorite(motelId);
    } catch {
      // silencioso: o coração simplesmente não muda
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      api<{ motels: Motel[] }>(`/api/motels?search=${encodeURIComponent(search)}&limit=20`, { auth: false })
        .then((res) => setMotels(res.motels))
        .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao buscar motéis.'));
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <PageShell>
      <PageTitle title="Encontre seu refúgio" subtitle="Busque por nome, cidade ou bairro." />

      <form role="search" onSubmit={(e) => e.preventDefault()} className="group mb-6 flex items-center gap-3 border-b border-rosegold/40 pb-3 transition-colors duration-300 focus-within:border-rosegold">
        <SearchIcon className="h-5 w-5 shrink-0 text-champagne/60" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar motel ou localização"
          aria-label="Buscar motel ou localização"
          className="w-full bg-transparent text-base font-light text-champagne placeholder:text-champagne/45 focus:outline-none"
        />
      </form>

      {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

      {motels === null && !error && (
        <div className="space-y-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[20px] bg-wine-850/70" />
          ))}
        </div>
      )}

      {motels !== null && motels.length === 0 && (
        <p className="mt-10 text-center text-sm font-light text-champagne/50">
          Nenhum motel encontrado.
          <br />
          Tente outro termo de busca.
        </p>
      )}

      <ul className="space-y-4">
        {motels?.map((motel) => (
          <li key={motel._id}>
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
                <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_45%,rgba(217,138,126,0.4),transparent_75%)]" />
              </div>
              <button
                type="button"
                aria-label={`Favoritar ${motel.name}`}
                aria-pressed={user?.favorites.includes(motel._id) ?? false}
                onClick={(e) => {
                  e.stopPropagation();
                  favoritar(motel._id);
                }}
                className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-wine-900/60 backdrop-blur-sm transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
                  user?.favorites.includes(motel._id) ? 'text-rosegold' : 'text-champagne/80 hover:text-rosegold'
                }`}
              >
                <HeartIcon className="h-4.5 w-4.5" filled={user?.favorites.includes(motel._id) ?? false} />
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
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
