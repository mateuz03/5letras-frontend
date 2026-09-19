import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';

export function PerfilPage() {
  const { user, loading, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <PageShell>
        <div className="mt-8 h-48 animate-pulse rounded-[24px] bg-wine-850/70" aria-hidden="true" />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <PageTitle title="Seu perfil" />
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">
            Entre para acompanhar seus pontos,
            <br />
            reservas e privilégios.
          </p>
          <Link
            to="/login?redirect=/perfil"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-rosegold px-8 text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft"
          >
            Entrar
          </Link>
        </div>
      </PageShell>
    );
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const body: Record<string, string> = {};
      if (name) body.name = name;
      if (email) body.email = email;
      if (password) body.password = password;
      await api('/api/users/me', { method: 'PUT', body });
      await refresh();
      setName('');
      setEmail('');
      setPassword('');
      setMessage('Perfil atualizado com elegância.');
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-rosegold/30 bg-wine-850/70 px-4 py-3 text-sm font-light text-champagne placeholder:text-champagne/40 transition-colors duration-300 focus:border-rosegold focus:outline-none';

  return (
    <PageShell>
      <PageTitle title="Seu perfil" />

      <div className="mb-6 flex flex-col items-center rounded-[24px] border border-rosegold/25 bg-wine-850/80 px-5 py-7 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-rosegold/50 font-display text-2xl text-rosegold">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <h2 className="mt-3 font-display text-xl text-champagne">{user.name}</h2>
        <p className="text-sm font-light text-champagne/55">{user.email}</p>
        <p className="mt-3 rounded-full border border-rosegold/40 px-4 py-1 text-xs tracking-[0.18em] text-rosegold-soft uppercase">
          {user.points.toLocaleString('pt-BR')} pontos
        </p>
      </div>

      {message && <p className="mb-4 rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{message}</p>}

      {editing ? (
        <form onSubmit={salvar} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Nome</span>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder={user.name} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">E-mail</span>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={user.email} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Nova senha (opcional)</span>
            <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="min-h-[44px] flex-1 rounded-xl bg-rosegold text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft disabled:opacity-50"
            >
              {busy ? 'Salvando…' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="min-h-[44px] flex-1 rounded-xl border border-rosegold/40 text-xs tracking-[0.24em] text-rosegold uppercase transition-colors duration-300 hover:bg-wine-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-h-[48px] w-full rounded-xl border border-rosegold/35 text-xs tracking-[0.24em] text-champagne uppercase transition-colors duration-300 hover:bg-wine-850 focus-visible:outline focus-visible:outline-1 focus-visible:outline-rosegold"
          >
            Editar dados
          </button>
          <Link
            to="/suporte"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-rosegold/35 text-xs tracking-[0.24em] text-champagne uppercase transition-colors duration-300 hover:bg-wine-850"
          >
            Suporte
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="min-h-[48px] w-full rounded-xl border border-transparent text-xs tracking-[0.24em] text-champagne/50 uppercase transition-colors duration-300 hover:text-rosegold"
          >
            Sair da conta
          </button>
        </div>
      )}
    </PageShell>
  );
}
