import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, UserIcon, ChevronDownIcon, HeartAccentIcon, SearchIcon } from '@/icons';

export function TopBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-10 flex items-center justify-between px-5 pt-5"
    >
      <button
        type="button"
        aria-label="Abrir menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-champagne/80 transition-colors duration-300 hover:text-champagne focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex flex-col items-center select-none">
        <span className="font-display text-xl tracking-[0.42em] text-champagne pl-1">5LETRAS</span>
        <span className="mt-1 text-[10px] font-normal tracking-[0.52em] text-rosegold pl-1">MOTEL BOUTIQUE</span>
        <svg viewBox="0 0 48 8" className="mt-1.5 h-2 w-12 text-rosegold/70" fill="none" aria-hidden="true">
          <path d="M0 6h20l4-4 4 4h20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <button
        type="button"
        aria-label="Abrir perfil"
        className="flex h-11 w-11 items-center justify-center rounded-full text-champagne/80 transition-colors duration-300 hover:text-champagne focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
      >
        <UserIcon className="h-6 w-6" />
      </button>
    </motion.header>
  );
}

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative z-10 px-5 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        className="relative font-display text-[44px] leading-[1.08] text-champagne sm:text-5xl"
      >
        <HeartAccentIcon className="absolute -top-3 left-[186px] h-3.5 w-3.5 text-rosegold sm:left-[218px]" />
        Uma noite
        <br />
        inesquecível
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
        className="mt-10"
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get('q');
            navigate(`/buscar?q=${encodeURIComponent(String(value ?? ''))}`);
          }}
          className="group flex items-center gap-3 border-b border-rosegold/40 pb-3 transition-colors duration-300 focus-within:border-rosegold"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-champagne/60 transition-colors duration-300 group-focus-within:text-rosegold" />
          <input
            type="search"
            name="q"
            placeholder="Buscar suíte ou motel"
            aria-label="Buscar suíte ou motel"
            className="w-full bg-transparent text-base font-light tracking-wide text-champagne placeholder:text-champagne/45 focus:outline-none"
          />
        </form>
        <div className="mt-1 flex justify-center">
          <ChevronDownIcon className="h-4 w-4 text-rosegold/70" />
        </div>
      </motion.div>
    </section>
  );
}
