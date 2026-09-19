# 5 Letras — Frontend

Frontend do projeto **5 Letras — Motel Boutique**: Vite + React + TypeScript + Tailwind CSS v4, no estilo visual *Vinho & Champagne* (dark romântico boutique).

Backend da API: [mateuz03/5letras-backend](https://github.com/mateuz03/5letras-backend)

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

Por padrão a API é esperada em `http://localhost:5000`. Para apontar para outro endereço:

```bash
# .env
VITE_API_URL=https://sua-api.exemplo.com
```

Dica: para subir o backend com dados de demonstração (MongoDB em memória), use `npm run dev:memory` dentro da pasta do backend — login demo: `demo@5letras.com` / `demo123`.

## Build de produção

```bash
npm run build      # gera dist/
```

O app usa `HashRouter`, então o `dist/` funciona em qualquer hosting estático (e no WebView do APK) sem configuração de reescrita de rotas.

## Estrutura

- `src/pages/` — Login, Buscar, Detalhe do motel (suítes, período e reserva), Reservas, Privilégios, Perfil e Suporte
- `src/sections/` — Hero, carrossel de suítes e layout compartilhado (BottomNav, PageShell, Toast)
- `src/context/AuthContext.tsx` — sessão (JWT em `localStorage`), favoritos e dados do usuário
- `src/api/client.ts` — cliente HTTP com token e tratamento de erro
- `verdent-design/` — comps da direção visual escolhida
