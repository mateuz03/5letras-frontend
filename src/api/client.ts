// Produção usa a API do Render; dev usa localhost (ou VITE_API_URL no .env)
const API_URL: string =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? 'https://fiveletras-backend.onrender.com' : 'http://localhost:5000');

export function getToken(): string | null {
  return localStorage.getItem('5letras.token');
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('5letras.token', token);
  else localStorage.removeItem('5letras.token');
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

// Aviso de "API acordando": o plano free do Render dorme após ~15 min e a
// primeira resposta pode demorar até ~50s. Detectamos requisições lentas e
// notificamos a UI para mostrar um aviso em vez de deixar o usuário no vácuo.
type WakingListener = (waking: boolean) => void;

const wakingListeners = new Set<WakingListener>();
const SLOW_THRESHOLD_MS = 2500;
let slowInFlight = 0;

function emitWaking() {
  const waking = slowInFlight > 0;
  for (const cb of wakingListeners) cb(waking);
}

export function onApiWaking(cb: WakingListener): () => void {
  wakingListeners.add(cb);
  cb(slowInFlight > 0);
  return () => {
    wakingListeners.delete(cb);
  };
}

export function warmUpApi(): void {
  // Dispara um ping sem esperar resposta: desperta o servidor enquanto o
  // usuário navega pela tela inicial.
  void fetch(`${API_URL}/health`).catch(() => undefined);
}

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let markedSlow = false;
  const slowTimer = setTimeout(() => {
    markedSlow = true;
    slowInFlight += 1;
    emitWaking();
  }, SLOW_THRESHOLD_MS);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  } finally {
    clearTimeout(slowTimer);
    if (markedSlow) {
      slowInFlight -= 1;
      emitWaking();
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || 'Erro inesperado. Tente novamente.');
  }
  return data as T;
}

export { API_URL };
