import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { HomeIcon, SearchIcon, HeartIcon, TagIcon, UserIcon } from '@/icons';

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/buscar', label: 'Buscar', icon: SearchIcon },
  { to: '/reservas', label: 'Reservas', icon: HeartIcon },
  { to: '/recompensas', label: 'Privilégios', icon: TagIcon },
  { to: '/perfil', label: 'Perfil', icon: UserIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={false}
      className="sticky bottom-0 z-20 mt-auto border-t border-rosegold/15 bg-wine-900/90 backdrop-blur-md"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-[440px] items-stretch justify-between px-3 py-3 sm:px-6">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
                isActive ? 'text-rosegold' : 'text-champagne/55 hover:text-champagne/85'
              }`}
            >
              <Icon className="h-[21px] w-[21px]" filled={isActive && (to === '/' || to === '/reservas')} />
              <span className="text-[9.5px] font-normal tracking-[0.16em] uppercase">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-1 px-5 pb-8"
    >
      {children}
    </motion.main>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="pb-6 pt-8">
      <h1 className="font-display text-3xl text-champagne">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm font-light text-champagne/60">{subtitle}</p>}
    </header>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      role="status"
      className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[85%] rounded-full border border-rosegold/40 bg-wine-800/95 px-5 py-2.5 text-center text-sm text-champagne shadow-lg backdrop-blur-md"
    >
      {message}
    </motion.div>
  );
}
