import {RefObject, useEffect} from "react";

/**
 * Хук для реализации бесконечной прокрутки с использованием IntersectionObserver.
 */
type InfiniteScrollOptions = {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
};

export function useInfiniteScroll<T extends Element>(
    ref: RefObject<T | null>,
    callback: () => void,
    options?: InfiniteScrollOptions
) {
    useEffect(() => {
        const element = ref.current;
        if (!element) return; // Проверка на null

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            {
                root: options?.root ?? null,
                rootMargin: options?.rootMargin ?? '500px',
                threshold: options?.threshold ?? 0.1,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
    }, [ref, callback, options]);
}
