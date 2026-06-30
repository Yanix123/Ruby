# UI & styling

**Tailwind v4 + shadcn**. The shadcn layer is the `pkg/theme` integration; app-specific composites live in `shared/ui` and `widgets`.

## `pkg/theme` (shadcn)

- **`lib/utils.ts`** — `cn(...)` = `twMerge(clsx(...))`.
- **`theme.provider.tsx`** — `next-themes` `ThemeProvider` (`attribute='class'`, `defaultTheme='system'`).
- **`ui/`** — shadcn primitives: `button`, `input`, `label`, `card`, `skeleton`, `sonner`, `spinner` (new-york style, neutral base, CVA variants). `components.json` aliases `@/pkg/theme/*`.
- Deps: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `sonner`, `next-themes`, `@radix-ui/*`, `tw-animate-css`.

## `shared/ui` (app primitives)

Built on the theme: `text-field` (Label + input via `cn`), `skeleton`, `movie-card` (presentational `MovieCardView` using `Card`, + `posterUrl` util). Widgets (`movie-card`, `favorites-list`, `site-header`) compose these.

## Styling

- **`config/styles/global.css`** — `@import 'tailwindcss'` + `tw-animate-css`, the shadcn CSS-variable theme (`:root` / `.dark`), `@theme inline` mapping (fonts wired to the Geist CSS vars), and base resets. Imported once in the root layout.
- **Dark mode** — `next-themes` toggles the `.dark` class; `<html suppressHydrationWarning>` in the root layout.
- **Toasts** — sonner `Toaster` mounted in the root layout (`position='top-center'`).
- **Fonts** — `config/fonts/font.ts` declares Geist Sans/Mono via `next/font`; exposed as CSS variables. See [[config-and-env]].

## Buttons & forms
Use the theme `Button` (note its default `type='button'` — set `type='submit'` in forms). Inputs go through `shared/ui/text-field`. See [[state-and-forms]].
