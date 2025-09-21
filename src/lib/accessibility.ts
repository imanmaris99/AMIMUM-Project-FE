// Accessibility Utilities and Hooks
import React, { useEffect, useRef, useState } from 'react';

// Focus management utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];
  private static currentFocus: HTMLElement | null = null;

  static saveFocus() {
    this.currentFocus = document.activeElement as HTMLElement;
    if (this.currentFocus) {
      this.focusHistory.push(this.currentFocus);
    }
  }

  static restoreFocus() {
    if (this.focusHistory.length > 0) {
      const previousFocus = this.focusHistory.pop();
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }
  }

  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, itemsRef.current.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(itemsRef.current.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
          itemsRef.current[focusedIndex]?.click();
        }
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    itemsRef,
    handleKeyDown
  };
}

// Screen reader announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ARIA utilities
export const ARIA = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Create ARIA attributes object
  createAttributes: (options: {
    label?: string;
    describedBy?: string;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    live?: 'polite' | 'assertive' | 'off';
    atomic?: boolean;
  }) => {
    const attrs: Record<string, string | boolean> = {};
    
    if (options.label) attrs['aria-label'] = options.label;
    if (options.describedBy) attrs['aria-describedby'] = options.describedBy;
    if (options.expanded !== undefined) attrs['aria-expanded'] = options.expanded;
    if (options.selected !== undefined) attrs['aria-selected'] = options.selected;
    if (options.disabled !== undefined) attrs['aria-disabled'] = options.disabled;
    if (options.hidden !== undefined) attrs['aria-hidden'] = options.hidden;
    if (options.live) attrs['aria-live'] = options.live;
    if (options.atomic !== undefined) attrs['aria-atomic'] = options.atomic;
    
    return attrs;
  }
};

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// Skip link component
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return React.createElement(
    'a',
    {
      href,
      className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:shadow-lg"
    },
    children
  );
}

// Focus visible polyfill
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      setIsFocusVisible(true);
    };
    
    const handleBlur = () => {
      setIsFocusVisible(false);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };
    
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);
  
  return isFocusVisible;
}

// Accessibility testing utilities
export const A11yTest = {
  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    return focusableSelectors.some(selector => element.matches(selector));
  },
  
  // Check if element has proper ARIA labels
  hasAriaLabel: (element: HTMLElement): boolean => {
    return !!(element.getAttribute('aria-label') || 
              element.getAttribute('aria-labelledby') ||
              element.textContent?.trim());
  },
  
  // Check color contrast ratio
  checkContrast: (foreground: string, background: string): boolean => {
    const ratio = getContrastRatio(foreground, background);
    return ratio >= 4.5; // WCAG AA standard
  }
};
