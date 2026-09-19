import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/suites';
import { StarIcon, HeartIcon, ChevronRightIcon } from '@/icons';

interface FeaturedSuite {
  motelId: string;
  motelName: string;
  suiteName: string;
  price: number;
  rating: number;
}

type ArtVariant = 'desejo' | 'intima' | 'panoramica';
const ART_CYCLE: ArtVariant[] = ['desejo', 'intima', 'panoramica'];

/*
 * Substitutos visuais das fotos de suíte (geração de imagens indisponível no
 * momento). Cada variante recria o clima da foto do comp com gradientes CSS.
 * Quando houver fotos reais, trocar por <img> mantendo o mesmo contêiner.
 */
function SuiteArt({ variant }: { variant: ArtVariant }) {
  const base =
    'absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]';

  if (variant === 'desejo') {
    return (
      <div className={base} aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,#4d2739_0%,#2a1520_45%,#170d14_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_30%_at_25%_38%,rgba(217,138,126,0.5),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(30%_20%_at_70%_30%,rgba(243,233,220,0.22),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-wine-950/85 to-transparent" />
      </div>
    );
  }
  if (variant === 'intima') {
    return (
      <div className={base} aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_20%_10%,#3a1e2e_0%,#22141d_50%,#120a10_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_26%_at_60%_62%,rgba(217,138,126,0.55),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(26%_16%_at_35%_70%,rgba(243,233,220,0.16),transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-wine-950/85 to-transparent" />
      </div>
    );
  }
  return (
    <div className={base} aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2a1520_0%,#1c1119_55%,#120a10_100%)]" />
      <div className="absolute right-[12%] top-[14%] h-[46%] w-[52%] bg-[linear-gradient(180deg,rgba(217,138,126,0.4),rgba(217,138,126,0.08))] [clip-path:polygon(0_18%,50%_0,100%_18%,100%_100%,0_100%)] opacity-80" />
      <div className="absolute right-[18%] top-[30%] h-[28%] w-[40%] bg-[radial-gradient(60%_60%_at_50%_60%,rgba(243,233,220,0.5),transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-wine-950/85 to-transparent" />
    </div>
  );
}

function SuiteCard({ suite, index }: { suite: FeaturedSuite; index: number }) {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  const art = ART_CYCLE[index % ART_CYCLE.length];
  const favorited = user?.favorites.includes(suite.motelId) ?? false;

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) {
      navigate('/login?redirect=/');
      return;
    }
    try {
      await toggleFavorite(suite.motelId);
    } catch {
      // silencioso: o coração simplesmente não muda se a rede falhar
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.55 + index * 0.15, ease: 'easeOut' }}
      onClick={() => navigate(`/motel/${suite.motelId}`)}
      className="group w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-[20px] border border-rosegold/30 bg-wine-850/80 backdrop-blur-sm transition-colors duration-500 hover:border-rosegold/60 sm:w-[300px]"
    >
      <div className="relative h-[240px] overflow-hidden">
        <SuiteArt variant={art} />
        <button
          type="button"
          aria-label={`Favoritar ${suite.suiteName} do ${suite.motelName}`}
          aria-pressed={favorited}
          onClick={handleFavorite}
          className={`absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
            favorited ? 'text-rosegold' : 'text-champagne/90 hover:text-rosegold'
          }`}
        >
          <HeartIcon className="h-5.5 w-5.5" filled={favorited} />
        </button>
        <div className="absolute inset-x-5 bottom-3.5">
          <p className="text-[10px] font-normal tracking-[0.42em] text-rosegold-soft uppercase">{suite.motelName}</p>
          <h3 className="mt-0.5 font-display text-[28px] italic leading-tight text-champagne">{suite.suiteName}</h3>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-center gap-1 border-t border-rosegold/20 pt-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-3.5 w-3.5 text-rosegold" />
          ))}
          <span className="ml-1.5 text-sm text-champagne/85">
            {suite.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
          </span>
        </div>

        <p className="mt-3 text-[10px] tracking-[0.3em] text-champagne/50 uppercase">A partir de</p>
        <p className="mt-0.5 font-display text-2xl text-champagne">R$ {formatPrice(suite.price)}</p>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="w-[280px] shrink-0 overflow-hidden rounded-[20px] border border-rosegold/20 bg-wine-850/60 sm:w-[300px]" aria-hidden="true">
      <div className="h-[240px] animate-pulse bg-wine-800/70" />
      <div className="space-y-3 px-5 pb-5 pt-4">
        <div className="h-3.5 w-24 animate-pulse rounded bg-wine-800/70" />
        <div className="h-6 w-40 animate-pulse rounded bg-wine-800/70" />
      </div>
    </div>
  );
}

export function SuiteCarousel() {
  const [suites, setSuites] = useState<FeaturedSuite[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ motels: { _id: string; name: string; rating: number; suites?: { name: string; price: number }[] }[] }>(
      '/api/motels?limit=20',
      { auth: false },
    )
      .then((res) => {
        const featured: FeaturedSuite[] = res.motels.flatMap((motel) =>
          (motel.suites ?? []).map((s) => ({
            motelId: motel._id,
            motelName: motel.name,
            suiteName: s.name,
            price: s.price,
            rating: motel.rating ?? 0,
          })),
        );
        setSuites(featured.slice(0, 8));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar as suítes.'));
  }, []);

  return (
    <section className="relative z-10 mt-9" aria-labelledby="suites-heading">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
        className="flex items-center justify-between px-5"
      >
        <h2 id="suites-heading" className="text-xs font-normal tracking-[0.38em] text-rosegold uppercase">
          Suítes em destaque
        </h2>
        <Link
          to="/buscar"
          className="flex items-center gap-1 text-xs font-normal tracking-[0.28em] text-rosegold uppercase transition-colors duration-300 hover:text-rosegold-soft focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
        >
          Ver todas
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6">
        {error && (
          <p className="w-full rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">
            {error}
          </p>
        )}
        {!error && suites === null && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!error && suites !== null && suites.length === 0 && (
          <p className="text-sm font-light text-champagne/50">Nenhuma suíte disponível no momento.</p>
        )}
        {suites?.map((suite, i) => (
          <div key={`${suite.motelId}-${suite.suiteName}`} className="snap-start">
            <SuiteCard suite={suite} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
