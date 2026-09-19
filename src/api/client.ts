const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

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

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || 'Erro inesperado. Tente novamente.');
  }
  return data as T;
}

export { API_URL };
