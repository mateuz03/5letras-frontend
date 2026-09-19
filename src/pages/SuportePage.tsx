import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { PageShell, PageTitle } from '@/sections/Layout';

interface Ticket {
  _id: string;
  issueType: string;
  message: string;
  status: string;
  createdAt: string;
}

const tipos = [
  { value: 'bug', label: 'Problema técnico' },
  { value: 'suggestion', label: 'Sugestão' },
  { value: 'compliment', label: 'Elogio' },
  { value: 'other', label: 'Outro assunto' },
];

export function SuportePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState('bug');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      api<Ticket[]>('/api/support/my-tickets')
        .then(setTickets)
        .catch(() => setTickets([]));
    }
  }, [user]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api('/api/support/tickets', { body: { issueType, message } });
      setMessage('');
      setFeedback('Mensagem enviada. Responderemos em breve.');
      const list = await api<Ticket[]>('/api/support/my-tickets');
      setTickets(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.');
    } finally {
      setBusy(false);
    }
  }

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
        <PageTitle title="Suporte" />
        <div className="mt-10 text-center">
          <p className="text-sm font-light text-champagne/60">Entre na sua conta para abrir um atendimento.</p>
          <button
            type="button"
            onClick={() => navigate('/login?redirect=/suporte')}
            className="mt-6 min-h-[44px] rounded-xl bg-rosegold px-8 text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-colors duration-300 hover:bg-rosegold-soft"
          >
            Entrar
          </button>
        </div>
      </PageShell>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-rosegold/30 bg-wine-850/70 px-4 py-3 text-sm font-light text-champagne placeholder:text-champagne/40 transition-colors duration-300 focus:border-rosegold focus:outline-none';

  return (
    <PageShell>
      <PageTitle title="Suporte" subtitle="Estamos aqui para ajudar, com discrição." />

      <form onSubmit={enviar} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Assunto</span>
          <select className={inputClass} value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            {tipos.map((t) => (
              <option key={t.value} value={t.value} className="bg-wine-900">
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] tracking-[0.28em] text-champagne/50 uppercase">Mensagem</span>
          <textarea
            className={`${inputClass} min-h-[110px] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Conte-nos o que aconteceu…"
          />
        </label>
        {error && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{error}</p>}
        {feedback && <p className="rounded-xl border border-rosegold/40 bg-wine-800/60 px-4 py-3 text-sm text-rosegold-soft">{feedback}</p>}
        <button
          type="submit"
          disabled={busy || !message.trim()}
          className="min-h-[48px] w-full rounded-xl bg-rosegold text-xs font-normal tracking-[0.24em] text-wine-950 uppercase transition-all duration-300 hover:bg-rosegold-soft disabled:opacity-50"
        >
          {busy ? 'Enviando…' : 'Enviar mensagem'}
        </button>
      </form>

      {tickets.length > 0 && (
        <>
          <h2 className="mt-9 text-xs font-normal tracking-[0.38em] text-rosegold uppercase">Seus atendimentos</h2>
          <ul className="mt-4 space-y-2.5">
            {tickets.map((t) => (
              <li key={t._id} className="rounded-xl border border-rosegold/15 bg-wine-850/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.18em] text-rosegold-soft uppercase">
                    {tipos.find((x) => x.value === t.issueType)?.label ?? t.issueType}
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-champagne/45 uppercase">{t.status}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-light text-champagne/70">{t.message}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
