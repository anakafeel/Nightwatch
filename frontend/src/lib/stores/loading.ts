import { create } from "zustand";

const SHOW_DELAY_MS = 150;
const MIN_VISIBLE_MS = 300;

interface LoadingState {
  /** Whether the overlay should be shown to the user */
  isVisible: boolean;
  /** Internal loading count (supports concurrent requests) */
  loadingCount: number;
  /** Sources currently loading */
  sources: Set<string>;
  /** Timestamp when overlay became visible */
  visibleSince: number | null;
  /** Start loading from a source */
  start: (source?: string) => void;
  /** Stop loading from a source */
  stop: (source?: string) => void;
}

let showTimeout: ReturnType<typeof setTimeout> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Global loading state store for managing overlay visibility.
 * Features:
 * - 150ms delay before showing (prevents flicker for fast loads)
 * - 300ms minimum visible time (prevents jarring quick flash)
 * - Supports concurrent loading sources
 */
export const useLoadingStore = create<LoadingState>((set, get) => ({
  isVisible: false,
  loadingCount: 0,
  sources: new Set(),
  visibleSince: null,

  start: (source = "default") => {
    const state = get();
    const newSources = new Set(state.sources);
    newSources.add(source);

    // Clear any pending hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // If already visible, just update count
    if (state.isVisible) {
      set({
        loadingCount: state.loadingCount + 1,
        sources: newSources,
      });
      return;
    }

    // Update count immediately
    set({
      loadingCount: state.loadingCount + 1,
      sources: newSources,
    });

    // Delay showing overlay to prevent flicker
    if (!showTimeout) {
      showTimeout = setTimeout(() => {
        showTimeout = null;
        const currentState = get();
        if (currentState.loadingCount > 0) {
          set({
            isVisible: true,
            visibleSince: Date.now(),
          });
        }
      }, SHOW_DELAY_MS);
    }
  },

  stop: (source = "default") => {
    const state = get();
    const newSources = new Set(state.sources);
    newSources.delete(source);
    const newCount = Math.max(0, state.loadingCount - 1);

    set({
      loadingCount: newCount,
      sources: newSources,
    });

    // If still loading, don't hide
    if (newCount > 0) {
      return;
    }

    // Clear pending show timeout if not yet visible
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    // If not visible, nothing to hide
    if (!state.isVisible) {
      return;
    }

    // Calculate remaining minimum visible time
    const visibleSince = state.visibleSince || Date.now();
    const elapsed = Date.now() - visibleSince;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    // Hide after minimum visible time
    hideTimeout = setTimeout(() => {
      hideTimeout = null;
      set({
        isVisible: false,
        visibleSince: null,
      });
    }, remaining);
  },
}));
