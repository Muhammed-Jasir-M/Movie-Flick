import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search inputs)
 * @param {any} value Value to debounce
 * @param {number} delay Delay in milliseconds (default: 300ms)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
