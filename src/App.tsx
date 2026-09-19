import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { BottomNav } from '@/sections/Layout';
import { TopBar, Hero } from '@/sections/Hero';
import { SuiteCarousel } from '@/sections/Suites';
import { LoginPage } from '@/pages/LoginPage';
import { BuscarPage } from '@/pages/BuscarPage';
import { MotelDetailPage } from '@/pages/MotelDetailPage';
import { ReservasPage } from '@/pages/ReservasPage';
import { RecompensasPage } from '@/pages/RecompensasPage';
import { PerfilPage } from '@/pages/PerfilPage';
import { SuportePage } from '@/pages/SuportePage';

/*
 * Substituto visual do fundo fotográfico do hero (foto da suíte à direita,
 * dissolvendo no bordô) — geração de imagens indisponível no momento.
 * Recrea o clima do comp com camadas de gradiente e vinheta.
 */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden" aria-hidden="true">
      {/* Foto-substituto: cena quente à direita, escurecendo à esquerda */}
      <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_88%_18%,#5a2c3d_0%,#3a1e2e_34%,#22141d_62%,#1c1119_88%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(30%_22%_at_78%_26%,rgba(243,233,220,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(22%_16%_at_92%_44%,rgba(217,138,126,0.35),transparent_75%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(18%_12%_at_70%_12%,rgba(217,138,126,0.22),transparent_75%)]" />
      {/* Vinheta e fusão com o fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,16,0.55)_0%,transparent_30%,transparent_55%,#120a10_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#120a10_0%,rgba(18,10,16,0.4)_30%,transparent_60%)]" />
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
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/buscar" element={<BuscarPage />} />
            <Route path="/motel/:id" element={<MotelDetailPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/recompensas" element={<RecompensasPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/suporte" element={<SuportePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
