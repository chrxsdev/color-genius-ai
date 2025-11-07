# Explore Grid Layout

## Overview

The Explore grid powers the Pinterest-style palette browsing experience. Every card displays a color palette, the creator, and interaction controls (likes, copy). We balance aesthetics with performance and stability across server-rendered (SSR) and client-rendered views.

## Goals

- Maintain a masonry-like appearance without layout jumps.
- Support infinite scrolling with predictable animation timing.
- Keep the app free from hydration mismatches between SSR and client renders.
- Provide deterministic card heights while staying accessible and easy to reason about.

## Architecture Highlights

### 1. Responsive Column Management (React-controlled)

- **Why:** Tailwind's `columns-*` relies on browser-driven column balancing. While convenient, it causes reflow issues when new content is appended, reshuffling previously rendered cards and triggering hydration warnings.
- **How:** We calculate column assignments in React, using the screen width to determine the number of columns (1 on phones, 2 on tablets, 4 on desktops). Cards keep their positions as data streams in, so the DOM stays in sync with SSR output.

### 2. Height Pattern Utility (`utils/patterns.ts`)

- Exposes `getHeightPattern(index)` which alternates `medium` and `tall` heights.
- **Why this pattern:** A simple cadence keeps the layout varied without randomness. By basing it solely on the insertion order, heights are deterministic, eliminating SSR/CSR drift.
- **Why it lives in `utils`:** Keeping layout logic shared and reusable makes future components consistent and avoids duplicating logic in the grid itself.

### 3. Palette Layout State (`ExplorePaletteGrid.tsx`)

The component maintains several state variables to orchestrate layout, pagination, and animations:

#### State Variables

- **`currentPalettes`**: Array of `PaletteLayoutItem[]` that stores each palette along with its `heightPattern` and `positionIndex`. This ensures that once a card is assigned a height and position, it never changes—preventing layout shifts during infinite scroll or re-renders.

- **`pagesLoaded`**: Number tracking how many pages of palettes have been fetched. Starts at `1` and increments with each successful load. Used as the `offset` parameter when requesting more data.

- **`hasMore`**: Boolean indicating whether additional palettes are available. Controls the visibility of the infinite scroll sentinel (loader). Set to `false` when the API returns no more data or an error occurs.

- **`activeSort`**: Mirrors the current `sortBy` prop (`'recent'` or `'popular'`). Kept in state so that pagination requests use the same sorting strategy even if the prop changes mid-session.

- **`latestBatchStartIndex`**: Number marking the start index of the most recently loaded batch. Used to calculate animation delays—only cards with `positionIndex >= latestBatchStartIndex` get staggered entry animations, keeping previously loaded cards stable.

- **`columnCount`**: Number of columns to display, calculated from viewport width. Starts at `4` to match SSR output, then updates client-side via resize listener to reflect responsive breakpoints (1 for mobile, 2 for tablet, 4 for desktop).

#### Effects

1. **Sort synchronization** (`useEffect([sortBy])`): Updates `activeSort` whenever the prop changes, ensuring pagination requests stay aligned with the current sort selection.

2. **Palette remapping** (`useEffect([palettes, sortBy])`): Resets the grid when server data or sort order changes. Maps incoming palettes to `PaletteLayoutItem` with deterministic heights, resets pagination counters, and clears the animation batch marker.

3. **Responsive column setup** (`useEffect([])`): Runs once after mount to attach a resize listener that updates `columnCount` based on `window.innerWidth`. Ensures the grid adapts to viewport changes while avoiding SSR mismatches (initial server render always uses `1` column).

4. **Infinite scroll trigger** (`useEffect([inView, hasMore, loadMorePalettes])`): Fires `loadMorePalettes` when the sentinel loader becomes visible and more data is available, automating pagination as the user scrolls.

#### Functions

- **`getResponsiveColumnCount(width)`**: Pure helper that returns the appropriate column count for a given viewport width. Encapsulates breakpoint logic (640px → 1 col, 1024px → 2 cols, else 4 cols).

- **`loadMorePalettes`**: Async callback that fetches the next page of palettes, maps them to layout items with continued height patterns and position indices, appends them to `currentPalettes`, and updates pagination state. Also sets `latestBatchStartIndex` so only new cards animate in.

- **`columns` (memoized)**: Distributes `currentPalettes` into column arrays via round-robin (`index % columnCount`). Recomputed only when `columnCount` or `currentPalettes` changes, ensuring stable references and avoiding unnecessary re-renders.

### 4. Hydration Safety

- Initial column count defaults to `1` on both server and client. Only after hydration do we adjust columns based on viewport width.
- Avoids `Math.random()`, `Date.now()`, or other non-deterministic values during SSR.
- Result: No hydration warnings; SSR markup matches what the client expects.

### 5. Animation Strategy

- Uses Framer Motion to animate cards with a slight upward slide and fade-in.
- Delay is derived from `positionIndex - latestBatchStartIndex`, so only the newest batch staggers in while existing cards remain stable.

## Interaction Flow

1. **Initial render:** Server supplies the first batch of palettes. Heights are deterministic, columns start at 1, and layout matches across SSR/CSR.
2. **Resize handling:** Client sets the column count whenever the viewport changes, preserving card order.
3. **Infinite scroll:** When the sentinel loader enters the viewport, more palettes are fetched and appended with their precomputed heights.
4. **Updates:** Likes and other card interactions only update local state; layout data remains intact.

## Why This Implementation

- **Stability:** React-owned columns prevent browser reflow, preserving user context.
- **Predictability:** The alternating height pattern avoids randomization complexity while still delivering visual variety.
- **SSR Compatibility:** Deterministic output keeps Next.js hydration happy and avoids layout flicker.
- **Maintainability:** Cross-file separation (`ExplorePaletteGrid.tsx` for structure, `utils/patterns.ts` for pattern logic) supports reuse and clearer testing.

## Future Considerations

- We can add more height variants by extending `getHeightPattern` if design needs change, keeping deterministic logic intact.
- Column counts or breakpoints can be tuned in one place (`getResponsiveColumnCount`) without touching component logic.
- Additional effects (e.g., filtering, sorting) can reuse the same layout state without sacrificing stability.

---

The current setup blends user experience, performance, and developer ergonomics, making the Explore grid trustworthy for browsing large color-palette collections.
