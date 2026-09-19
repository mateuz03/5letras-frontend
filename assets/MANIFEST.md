# Asset Manifest — 5Letras Frontend

## Decisão de orçamento

A geração de imagens estava indisponível (Free Mode) durante esta restauração.
Os visuais fotográficos do comp (fundo do hero e fotos das suítes) foram
recriados como **substitutos em CSS puro** (gradientes em camadas + vinhetas),
mantendo paleta, clima e proporções do comp aprovado.

Quando a geração de imagens estiver disponível, gerar os assets abaixo
(ancorados em `verdent-design/stage1/comp-4-vinho-champagne.png`) e substituir
os componentes `HeroBackdrop` (src/App.tsx) e `SuiteArt`
(src/sections/Suites.tsx) por `<img>` — os contêineres já estão prontos.

## Images (pendentes de geração)

| Asset planejado | Substituto atual | Fonte de estilo |
|---|---|---|
| `hero-suite-night.png` (1792x1024) | `HeroBackdrop` CSS | comp-4 |
| `suite-desejo.png` (1024x1536) | `SuiteArt` variante `desejo` | comp-4 |
| `suite-intima.png` (1024x1536) | `SuiteArt` variante `intima` | comp-4 |
| `suite-panoramica.png` (1024x1536) | `SuiteArt` variante `panoramica` | comp-4 |

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
