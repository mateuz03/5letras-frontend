# Asset Manifest — 5Letras Frontend

## Images (resolvidas)

Fotos do Unsplash (licença Unsplash, uso gratuito), self-hosted em
`public/images/` (sem dependência de CDN no APK). Seleção curada no clima
Vinho & Champagne em 2026-10-04:

| Arquivo | Uso | Fonte (unsplash.com/photos/) |
|---|---|---|
| `hero-suite-night.jpg` | fundo do hero (App.tsx `HeroBackdrop`) | photo-1776763018970-9fdf66bd4666 |
| `suite-desejo.jpg` | card Suíte Desejo (Suites.tsx) | photo-1637515128249-df66173ee9b4 |
| `suite-intima.jpg` | card Suíte Íntima / Bordeaux | photo-1785317178009-09221807f2bd |
| `suite-panoramica.jpg` | card Suíte Panorâmica / Champagne | photo-1592229505726-ca121723b8ef |

O mapeamento suíte → foto está em `SUITE_PHOTOS` (src/sections/Suites.tsx).
A arte CSS (`SuiteArt`) permanece como fallback sob a foto. Capas dos motéis
usam `motel.image` do banco (URLs Unsplash no seed) em Buscar e detalhe.

Quando a geração de imagens estiver disponível, avaliar substituir pelas
fotos autorais (ancoradas em `verdent-design/stage1/comp-4-vinho-champagne.png`).

## Icons (SVG manual, em código)

`src/icons/index.tsx` — Menu, User, Search, Heart (outline/filled),
ChevronDown, ChevronRight, Star, Tag, Home, HeartAccent. Todos
`currentColor`, traço 1.5.

## Logo

Wordmark "5LETRAS / MOTEL BOUTIQUE" em código (Playfair Display +
letter-spacing), sem raster. `public/favicon.svg` monograma "5" + coração,
referenciado em `index.html`.

## Fontes

Google Fonts: Playfair Display (400/500/600 + itálicas) e Jost (300/400/500),
`display=swap`.
