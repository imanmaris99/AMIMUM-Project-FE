// Application Initialization and Setup
import { initializeAnalytics } from './analytics';
import { PerformanceMonitor } from './performance';
import { SessionManager } from './auth';
import { ErrorHandler } from './errorHandler';

interface WindowWithDebug extends Window {
  AMIMUM_DEBUG?: {
    PerformanceMonitor: typeof PerformanceMonitor;
    ErrorHandler: typeof ErrorHandler;
    SessionManager: typeof SessionManager;
    clearStorage: () => void;
    getAnalytics: () => {
      events: unknown[];
      performance: unknown;
    };
  };
  analytics?: {
    getEvents: () => unknown[];
  };
}

// Initialize all application services
export function initializeApp() {
  // Initialize performance monitoring
  PerformanceMonitor.startWebVitalsMonitoring();
  
  // Initialize analytics
  const session = SessionManager.getSession();
  initializeAnalytics(session?.user.id);
  
  // Initialize error tracking
  setupGlobalErrorHandling();
  
  // Initialize performance optimizations
  setupPerformanceOptimizations();
  
  // Initialize accessibility features
  setupAccessibilityFeatures();
  
}

// Global error handling setup
function setupGlobalErrorHandling() {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handleError(
      new Error(event.reason),
      'UnhandledPromiseRejection',
      false
    );
  });
  
  // Global errors
  window.addEventListener('error', (event) => {
    ErrorHandler.handleError(
      event.error || new Error(event.message),
      'GlobalError',
      false
    );
  });
}

// Performance optimizations
function setupPerformanceOptimizations() {
  // Preload critical resources
  preloadCriticalResources();
  
  // Setup service worker for caching
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .then(/* registration => {
      } */)
      .catch(/* error => {
      } */);
  }
  
  // Setup intersection observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Preload critical resources
function preloadCriticalResources() {
  const criticalResources = [
    '/fonts/Plus-Jakarta-Sans.woff2',
    '/fonts/Inter.woff2',
    '/logo_toko.svg'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.woff2') ? 'font' : 'image';
    if (resource.endsWith('.woff2')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Accessibility features setup
function setupAccessibilityFeatures() {
  // Skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:shadow-lg';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main content landmark
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }
  
  // Setup focus management
  setupFocusManagement();
  
  // Setup keyboard navigation
  setupKeyboardNavigation();
}

// Focus management
function setupFocusManagement() {
  let lastFocusedElement: HTMLElement | null = null;
  
  // Save focus when opening modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      lastFocusedElement = document.activeElement as HTMLElement;
    }
  });
  
  // Restore focus when closing modals
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-modal-close]') && lastFocusedElement) {
      setTimeout(() => {
        lastFocusedElement?.focus();
        lastFocusedElement = null;
      }, 100);
    }
  });
}

// Keyboard navigation
function setupKeyboardNavigation() {
  // Escape key handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals or dropdowns
      const openModal = document.querySelector('[data-modal-open]');
      if (openModal) {
        (openModal as HTMLElement).click();
      }
      
      const openDropdown = document.querySelector('[data-dropdown-open]');
      if (openDropdown) {
        (openDropdown as HTMLElement).click();
      }
    }
  });
}

// Cleanup function
export function cleanupApp() {
  PerformanceMonitor.stopMonitoring();
  ErrorHandler.clearRetryAttempts();
  
  // Remove event listeners
  window.removeEventListener('unhandledrejection', () => {});
  window.removeEventListener('error', () => {});
  
}

// Development tools
if (process.env.NODE_ENV === 'development') {
  // Expose debugging tools to window
  const windowWithDebug = window as WindowWithDebug;
  windowWithDebug.AMIMUM_DEBUG = {
    PerformanceMonitor,
    ErrorHandler,
    SessionManager,
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
    },
    getAnalytics: () => {
      // Return analytics data for debugging
      return {
        events: windowWithDebug.analytics?.getEvents() || [],
        performance: PerformanceMonitor.getMetrics()
      };
    }
  };
  
}
