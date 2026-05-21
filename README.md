# Pokédex App

Aplicación Pokédex construida con React 18, RTK Query, Redux Persist y styled-components. Explorá Pokémon con infinite scroll, armá tu equipo de 6, y compará stats con un radar chart.

## Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Desarrollo con HMR
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Lint
pnpm lint

# Análisis con React Doctor
npx react-doctor@latest
```

## Estructura del proyecto

```
src/
├── api/                    # RTK Query API slice (PokeAPI)
├── app/                    # Redux store + persist config
├── features/
│   ├── comparison/         # Comparar 2 Pokémon (radar chart)
│   ├── favorites/          # Equipo de 6 (drag & drop)
│   ├── pokemon/            # Listado + detalle + cards
│   └── search/             # SearchBar con filtros
├── routes/                 # React Router v6
├── shared/
│   ├── components/         # Layout, Skeleton, CacheBanner, EmptyState
│   ├── hooks/              # useDebounce, useOnlineStatus, useCacheStatus
│   ├── theme/              # Dark theme + GlobalStyles
│   └── utils/              # pokemonHelpers
└── main.jsx                # Entry point
```

## Decisiones técnicas

### Cache con RTK Query

Se eligió RTK Query como capa de data fetching y cache por sobre alternativas como React Query o SWR:

- **Integración nativa con Redux**: el cache vive en el store, compartido entre componentes sin prop drilling
- **Persistencia del cache con redux-persist**: se usa `extractRehydrationInfo` en `createApi` para que RTK Query reconstruya su cache desde localStorage al recargar la página
- **`keepUnusedDataFor`** con tiempos diferenciados (reducidos para no inflar localStorage):
  - Listado: 120s (2 min)
  - Detalle + Species: 300s (5 min)
  - Types + Generaciones: 1800s (30 min)
- **`providesTags`/`invalidatesTags`** para invalidación automática del cache cuando los datos cambian
- **`skip`** en queries para evitar llamadas innecesarias (ej: `useGetDetailQuery` solo cuando hay un Pokémon seleccionado)
- **`whitelist`**: `['favorites', 'pokemonApi']` — ambos sobreviven al refresh

### Persistencia con redux-persist

Solo se persiste el slice de `favorites` y el cache de `pokemonApi` en `localStorage`:

- **Whitelist**: `['favorites', 'pokemonApi']` — el estado de conexión se regenera al recargar
- **`serializableCheck`** con constantes de redux-persist (`FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER`)
- **`PersistGate`** con `loading={null}` para evitar flash de estado vacío

### Indicador de datos cacheados vs frescos

El enunciado requiere "Indicar cuando se muestran datos cacheados vs frescos":

- **`useCacheStatus`** hook: retorna `'loading' | 'fetching' | 'cached' | 'fresh'` combinando `isOnline` + RTK Query status
- **`CacheBanner`** componente: banner amarillo "Sin conexión — Datos cacheados" y azul "Actualizando datos…"
- **`StatusDot`** en header: 3 colores (verde=online/fresh, amarillo=offline/cached, azul=fetching) + label "Offline · Cache"
- **Integrado** en `PokemonListPage` (infinite scroll) y `PokemonDetailPage` (detalle)

### Infinite scroll con "adjust state during render"

El listado principal usa el patrón [adjust state during render](https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes) de la documentación oficial de React, en lugar del anti-patrón `useEffect + setState`:

- Se acumulan los Pokémon en `allPokemon` directamente durante el render cuando `listData` cambia
- Se usa `prevPage` con `useState` (no `useRef`) porque el patrón necesita leer el valor durante el render — React Compiler prohíbe acceder refs en render
- `useInView` de `react-intersection-observer` como sentinel para detectar cuándo cargar la siguiente página

### Skeleton custom con efecto shimmer

Se reemplazó `react-loading-skeleton` por un componente custom:

- **Shimmer animation**: gradiente deslizante izq→der con colores del tema (`surfaceHover` → `surface` → `surfaceHover`)
- **API compatible**: `width`, `height`, `circle`, `borderRadius`, `count`, `style`
- **Sin dependencia externa**: una lib menos en el bundle, CSS más chico

### Code splitting con React.lazy()

Recharts (~500KB) se carga lazy solo cuando el usuario visita la página de comparación:

- Cada componente de recharts se importa con `React.lazy()` + `Suspense`
- El bundle se divide en 2 chunks: app (~456KB) + recharts (~503KB)
- El usuario no paga el costo de recharts si nunca compara Pokémon

### Online/Offline con useSyncExternalStore

El hook `useOnlineStatus` usa `useSyncExternalStore` para leer `navigator.onLine` (patrón recomendado por React) y un `useEffect` mínimo para sincronizar al store de Redux:

- `useSyncExternalStore` para leer el estado del browser (no genera re-renders innecesarios)
- `useEffect` + `useRef` para dispatch a Redux solo cuando el estado cambia (side-effect legítimo)

### Header responsive

El header usa un hamburger menu en mobile (≤480px):

- Nav colapsa en columna vertical con `flex-wrap` + `order`
- Al navegar se cierra el menú automáticamente
- Status badge muestra solo el dot en mobile (sin texto "Online")

### Empty states con ilustración

Componente `EmptyState` reutilizable con SVG inline de Pokéball:

- Props: `title`, `description`, `actionLabel` (opcional), `actionTo` (opcional)
- Ilustración SVG de Pokéball estilizada con opacidad 0.4
- Usado en `TeamPage` (equipo vacío) y `FilteredResults` (sin resultados)

## Mejoras futuras

- **TypeScript**: migrar a TS para type safety en los endpoints de PokeAPI y los reducers
- **React Compiler**: habilitar el compilador para optimización automática de re-renders
- **Service Worker + offline first**: cachear assets y respuestas de PokeAPI para funcionamiento offline completo
- **Virtualización de lista**: reemplazar infinite scroll con `react-virtuoso` o `@tanstack/virtual` para manejar miles de Pokémon sin DOM pesado
- **Test suite**: unit tests con Vitest + Testing Library para hooks, slices y componentes
- **E2E tests**: Playwright para flujos críticos (búsqueda, agregar al equipo, comparar)
- **i18n**: soporte multi-idioma (español/inglés) con react-intl
- **Accesibilidad**: audit con axe-core, mejorar ARIA labels y navegación por teclado
- **Dark/Light theme toggle**: el theme ya está centralizado, agregar un switch es trivial
- **PWA**: manifest + service worker para instalación como app nativa
- **Paginación server-side para búsqueda por nombre**: actualmente se descargan todos los nombres para filtrar en cliente; con un endpoint de búsqueda del lado del servidor sería más eficiente
- **Error boundaries**: capturar errores de render por componente en lugar de que toda la app crashee
