import { useEffect } from 'react';

/**
 * Custom hook for smooth horizontal mouse wheel scrolling
 * @param {React.RefObject} ref Element ref of the scrollable container
 * @param {any[]} deps Dependencies to re-attach listener
 * @param {number} multiplier Scroll speed multiplier (default 1.8)
 */
export const useHorizontalScroll = (ref, deps = [], multiplier = 1.8) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            const maxScrollLeft = el.scrollWidth - el.clientWidth;
            const canScrollRight = el.scrollLeft < maxScrollLeft - 10;
            const canScrollLeft = el.scrollLeft > 10;

            // Only hijack scroll horizontally if the slider can actually scroll further in that direction
            if ((isScrollingDown && canScrollRight) || (isScrollingUp && canScrollLeft)) {
                e.preventDefault();
                el.scrollBy({
                    left: e.deltaY * multiplier,
                    behavior: 'smooth',
                });
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, multiplier, ...deps]);
};

export default useHorizontalScroll;
