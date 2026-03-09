# Self-hosted fonts

Local woff2 files eliminate external requests to Google Fonts CDN,
preventing Safari's "advanced privacy protections" banner.

## Font files

| File | Family | Weight | Style |
|------|--------|--------|-------|
| `Inter-latin.woff2` | Inter | 400-700 | normal |
| `Cabin-500-latin.woff2` | Cabin | 500 | normal |
| `InstrumentSerif-Regular-latin.woff2` | Instrument Serif | 400 | normal |
| `InstrumentSerif-Italic-latin.woff2` | Instrument Serif | 400 | italic |
| `Manrope-latin.woff2` | Manrope | 400-600 | normal |

`@font-face` declarations are in `src/styles/tailwind.css`.
