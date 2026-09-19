import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageShell } from '@/sections/Layout';

type Mode = 'entrar' | 'criar';

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') ?? '/';

  const [mode, setMode] = useState<Mode>('entrar');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'entrar') await login(email, password);
      else await register(name, email, password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-rosegold/30 bg-wine-850/70 px-4 py-3.5 text-sm font-light text-champagne placeholder:text-champagne/40 transition-colors duration-300 focus:border-rosegold focus:outline-none';

  return (
    <PageShell>
      <header className="pb-8 pt-10 text-center">
        <span className="font-display text-xl tracking-[0.42em] text-champagne pl-1">5LETRAS</span>
        <p className="mt-1 text-[10px] tracking-[0.52em] text-rosegold pl-1">MOTEL BOUTIQUE</p>
        <h1 className="mt-6 font-display text-3xl text-champagne">
          {mode === 'entrar' ? 'Bem-vindo de volta' : 'Criar sua conta'}
        </h1>
        <p className="mt-1.5 text-sm font-light text-champagne/60">
          {mode === 'entrar'
            ? 'Sua noite inesquecível continua de onde parou.'
            : 'Junte-se a nós e acumule privilégios a cada estadia.'}
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 rounded-full border border-rosegold/30 p-1">
        {(['entrar', 'criar'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`min-h-[40px] rounded-full text-xs tracking-[0.24em] uppercase transition-all duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold ${
              mode === m ? 'bg-rosegold text-wine-950' : 'text-champagne/60 hover:text-champagne'
            }`}
          >
            {m === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        ))}
      </div>

      <motion.form
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={onSubmit}
        className="space-y-4"
        noValidate
      >
        {mode === 'criar' && (
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Nome</span>
            <input className={inputClass} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">E-mail</span>
          <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Senha</span>
          <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'} />
        </label>

        {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="min-h-[48px] w-full rounded-xl bg-rosegold text-sm font-normal tracking-[0.24em] text-wine-950 uppercase transition-all duration-300 hover:bg-rosegold-soft disabled:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne"
        >
          {busy ? 'Aguarde…' : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </motion.form>
    </PageShell>
  );
}
