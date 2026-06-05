import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import GuidedTour from './GuidedTour';

const TourContext = createContext(null);

export const useTour = () => useContext(TourContext) || {
  startTour: () => {},
  finishTour: () => {},
  hasSeen: () => true,
  running: false,
};

const seenKey = (id) => `avoices_tour_done_${id}`;

/**
 * App-level provider that owns guided-tour state and renders the overlay once.
 * Consumers call `startTour(tourId, steps)`; a tour auto-skips if already seen
 * (unless `{ force: true }`), and is marked seen when finished/closed.
 */
export function TourProvider({ children }) {
  const [state, setState] = useState({ run: false, steps: [], index: 0, tourId: null });

  const markSeen = useCallback((tourId) => {
    if (tourId) { try { localStorage.setItem(seenKey(tourId), '1'); } catch { /* ignore */ } }
  }, []);

  const hasSeen = useCallback((tourId) => {
    try { return !!localStorage.getItem(seenKey(tourId)); } catch { return false; }
  }, []);

  const startTour = useCallback((tourId, steps, { force = false } = {}) => {
    if (!Array.isArray(steps) || steps.length === 0) return;
    if (!force && tourId && hasSeen(tourId)) return;
    setState({ run: true, steps, index: 0, tourId });
  }, [hasSeen]);

  const finishTour = useCallback(() => {
    setState((s) => { markSeen(s.tourId); return { ...s, run: false }; });
  }, [markSeen]);

  const next = useCallback(() => {
    setState((s) => {
      if (s.index >= s.steps.length - 1) { markSeen(s.tourId); return { ...s, run: false }; }
      return { ...s, index: s.index + 1 };
    });
  }, [markSeen]);

  const back = useCallback(() => {
    setState((s) => ({ ...s, index: Math.max(0, s.index - 1) }));
  }, []);

  const value = useMemo(() => ({ startTour, finishTour, hasSeen, running: state.run }), [startTour, finishTour, hasSeen, state.run]);

  return (
    <TourContext.Provider value={value}>
      {children}
      <GuidedTour
        open={state.run}
        steps={state.steps}
        stepIndex={state.index}
        onNext={next}
        onBack={back}
        onClose={finishTour}
      />
    </TourContext.Provider>
  );
}

export default TourProvider;
