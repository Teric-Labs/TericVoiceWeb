import { useEffect } from 'react';
import { useTour } from './TourProvider';

/**
 * Auto-starts a studio's first-visit guided tour once its anchors are mounted.
 *
 * @param {string} tourId  unique tour id (see TOUR_IDS)
 * @param {Array}  steps   tour step definitions
 * @param {boolean} ready  start only once true (e.g. after initial render/load)
 * @param {number} delay   ms to wait so anchors are painted (default 600)
 */
export default function useStudioTour(tourId, steps, ready = true, delay = 600) {
  const { startTour } = useTour();
  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => startTour(tourId, steps), delay);
    return () => clearTimeout(t);
  }, [ready, tourId, steps, delay, startTour]);
}
