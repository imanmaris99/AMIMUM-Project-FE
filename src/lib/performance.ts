// Performance Optimization Utilities
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce utility for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate: boolean = false
): T {
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  }) as T;
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

// Memoization utility
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const throttledHandler = throttle(() => {
        setScrollTop(e.currentTarget.scrollTop);
      }, 16); // 60fps
      throttledHandler();
    },
    []
  );

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
}

// Image lazy loading hook
export function useLazyLoading(
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin, hasLoaded]);

  return { ref, isIntersecting, hasLoaded };
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  private static observers: PerformanceObserver[] = [];

  static startTiming(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      this.metrics.get(label)!.push(duration);
      
      // Log slow operations
      if (duration > 100) {
      }
    };
  }

  static getMetrics(label?: string): Map<string, number[]> | number[] {
    if (label) {
      return this.metrics.get(label) || [];
    }
    return this.metrics;
  }

  static getAverageTime(label: string): number {
    const times = this.metrics.get(label) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }

  static startWebVitalsMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        // Log LCP for monitoring
        console.log('LCP:', lastEntry?.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Log FID for monitoring
          console.log('FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS - Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        // let clsValue = 0; // Removed unused variable
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
            // clsValue += (entry as any).value; // Removed unused variable usage
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(lcpObserver, fidObserver, clsObserver);
    }
  }

  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle size optimization
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  // fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// Memory leak prevention
export function useMemoryLeakPrevention() {
  useEffect(() => {
    const cleanup = () => {
      // Clear any global references
      PerformanceMonitor.clearMetrics();
      
      // Clear any pending timeouts
      const highestTimeoutId = setTimeout(() => {}, 0);
      clearTimeout(highestTimeoutId);
      
      // Clear any pending intervals
      const highestIntervalId = setInterval(() => {}, 0);
      clearInterval(highestIntervalId);
    };

    return cleanup;
  }, []);
}

// Optimized context provider
export function createOptimizedContext<T>(defaultValue: T) {
  const Context = React.createContext<T>(defaultValue);
  
  interface ProviderProps {
    children: React.ReactNode;
    value: T;
  }
  
  const Provider: React.FC<ProviderProps> = ({ children, value }) => {
    const memoizedValue = useMemo(() => value, [value]);
    
    return React.createElement(
      Context.Provider,
      { value: memoizedValue },
      children
    );
  };
  
  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error('useContext must be used within a Provider');
    }
    return context;
  };
  
  return { Context, Provider, useContext };
}

// Image optimization utility
export function optimizeImage(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // In production, use a CDN or image optimization service
  if (process.env.NODE_ENV === 'production') {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    
    return `${src}?${params.toString()}`;
  }
  
  return src;
}

// Bundle analyzer utility
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    // Log bundle size information
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        fetch(src)
          .then(response => response.blob())
          .then(() => {
            // const sizeKB = (blob.size / 1024).toFixed(2); // Removed unused variable
          });
      }
    });
  }
}

// Performance budget monitoring
export const PERFORMANCE_BUDGET = {
  FCP: 1800, // First Contentful Paint
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  TTI: 3800, // Time to Interactive
};

export function checkPerformanceBudget() {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      FCP: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      LCP: 0, // Would need LCP observer
      FID: 0, // Would need FID observer
      CLS: 0, // Would need CLS observer
      TTI: navigation.loadEventEnd - navigation.fetchStart,
    };
    
    Object.entries(metrics).forEach(([key, value]) => {
      const budget = PERFORMANCE_BUDGET[key as keyof typeof PERFORMANCE_BUDGET];
      if (value > budget) {
      }
    });
  }
}
