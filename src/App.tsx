import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { BottomNav, ApiWakingBanner } from '@/sections/Layout';
import { warmUpApi } from '@/api/client';
import { TopBar, Hero } from '@/sections/Hero';
import { SuiteCarousel } from '@/sections/Suites';
import { LoginPage } from '@/pages/LoginPage';
import { BuscarPage } from '@/pages/BuscarPage';
import { MotelDetailPage } from '@/pages/MotelDetailPage';
import { ReservasPage } from '@/pages/ReservasPage';
import { RecompensasPage } from '@/pages/RecompensasPage';
import { PerfilPage } from '@/pages/PerfilPage';
import { SuportePage } from '@/pages/SuportePage';
import { FavoritosPage } from '@/pages/FavoritosPage';
import { AvaliarPage } from '@/pages/AvaliarPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';

/*
 * Fundo fotográfico do hero: foto real da suíte (self-hosted em /images),
 * com camadas de gradiente para fundir com o bordô e garantir legibilidade.
 */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden" aria-hidden="true">
      <img
        src="/images/hero-suite-night.jpg"
        alt=""
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Vinheta e fusão com o fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,16,0.55)_0%,transparent_30%,transparent_55%,#120a10_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#120a10_0%,rgba(18,10,16,0.4)_30%,rgba(18,10,16,0.15)_60%,transparent_80%)]" />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <HeroBackdrop />
      <TopBar />
      <main className="flex-1">
        <Hero />
        <SuiteCarousel />
      </main>
    </>
  );
}

function Shell() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-wine-900 sm:my-0 sm:border-x sm:border-rosegold/10 lg:my-6 lg:min-h-[calc(100dvh-3rem)] lg:rounded-[28px] lg:shadow-[0_0_80px_rgba(217,138,126,0.08)]">
      <div className="relative flex min-h-dvh flex-col lg:min-h-[calc(100dvh-3rem)]">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Desperta a API do Render cedo (ping /health) para reduzir a espera
    // da primeira requisição real do usuário.
    warmUpApi();
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <ApiWakingBanner />
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/buscar" element={<BuscarPage />} />
            <Route path="/motel/:id" element={<MotelDetailPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/recompensas" element={<RecompensasPage />} />
            <Route path="/favoritos" element={<FavoritosPage />} />
            <Route path="/avaliar" element={<AvaliarPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/suporte" element={<SuportePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
