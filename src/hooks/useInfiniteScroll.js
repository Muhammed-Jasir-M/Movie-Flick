import { useEffect, useCallback } from 'react';

/**
 * Custom hook to handle window scroll pagination
 * @param {Function} callback Function to trigger when bottom threshold is reached
 * @param {boolean} hasMore Flag indicating if there are more pages available
 * @param {boolean} isLoading Flag indicating if data is currently being fetched
 * @param {number} threshold Distance in px from bottom to trigger callback (default: 250)
 */
export const useInfiniteScroll = (callback, hasMore = true, isLoading = false, threshold = 250) => {
    const handleScroll = useCallback(() => {
        if (!hasMore || isLoading) return;
        const scrollPosition = window.innerHeight + window.scrollY;
        const bottomOffset = document.body.offsetHeight - threshold;

        if (scrollPosition >= bottomOffset) {
            callback();
        }
    }, [callback, hasMore, isLoading, threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);
};

export default useInfiniteScroll;
