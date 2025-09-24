// Comprehensive Analytics and Monitoring System
import { PerformanceMonitor } from './performance';

// Event tracking interface
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, string | number | boolean>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

// User behavior tracking
export class UserBehaviorTracker {
  private static events: AnalyticsEvent[] = [];
  private static sessionId: string = this.generateSessionId();
  private static userId: string | null = null;
  private static isTracking: boolean = false;

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static startTracking(userId?: string) {
    this.isTracking = true;
    this.userId = userId || null;
    this.sessionId = this.generateSessionId();
    
    // Track page view
    this.trackEvent('page_view', 'navigation', 'view', window.location.pathname);
    
    // Track performance metrics
    this.trackPerformanceMetrics();
    
    // Track user interactions
    this.setupInteractionTracking();
  }

  static stopTracking() {
    this.isTracking = false;
    this.flushEvents();
  }

  static trackEvent(
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, string | number | boolean>
  ) {
    if (!this.isTracking) return;

    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label,
      value,
      properties,
      timestamp: new Date(),
      userId: this.userId || undefined,
      sessionId: this.sessionId
    };

    this.events.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
    }

    // Send to analytics service
    this.sendToAnalytics();
  }

  private static async sendToAnalytics(/* event: AnalyticsEvent */) {
    try {
      // In production, send to your analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Google Analytics, Mixpanel, etc.
        // await fetch('/api/analytics', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
      }
    } catch {
    }
  }

  private static trackPerformanceMetrics() {
    // Track Core Web Vitals
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        this.trackEvent('performance', 'web_vitals', 'fcp', undefined, fcp.startTime);
      }

      // Largest Contentful Paint
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
      if (lcp) {
        this.trackEvent('performance', 'web_vitals', 'lcp', undefined, lcp.startTime);
      }

      // Time to Interactive
      this.trackEvent('performance', 'web_vitals', 'tti', undefined, navigation.loadEventEnd - navigation.fetchStart);
    }
  }

  private static setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const element = target.closest('button, a, [role="button"]');
      
      if (element) {
        this.trackEvent('interaction', 'click', 'element', element.tagName, undefined, {
          text: element.textContent?.trim() || '',
          className: element.className,
          id: element.id
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('interaction', 'form', 'submit', form.id || 'unnamed');
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.trackEvent('interaction', 'scroll', 'depth', undefined, scrollDepth);
      }
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('interaction', 'page', 'visibility', document.visibilityState);
    });
  }

  private static flushEvents() {
    // Send all pending events
    this.events.forEach(() => this.sendToAnalytics());
    this.events = [];
  }

  static getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  static clearEvents() {
    this.events = [];
  }
}

// E-commerce specific tracking
export class EcommerceTracker {
  static trackProductView(productId: string, productName: string, category?: string) {
    UserBehaviorTracker.trackEvent('ecommerce', 'product', 'view', productName, undefined, {
      productId,
      category: category || ''
    });
  }

  static trackAddToCart(productId: string, productName: string, quantity: number = 1, price?: number) {
    UserBehaviorTracker.trackEvent('ecommerce', 'cart', 'add', productName, quantity, {
      productId,
      price: price || 0
    });
  }

  static trackRemoveFromCart(productId: string, productName: string, quantity: number = 1) {
    UserBehaviorTracker.trackEvent('ecommerce', 'cart', 'remove', productName, quantity, {
      productId
    });
  }

  static trackPurchase(orderId: string, total: number, items: Array<{id: string, name: string, quantity: number, price: number}>) {
    UserBehaviorTracker.trackEvent('ecommerce', 'purchase', 'complete', orderId, total, {
      orderId,
      items: JSON.stringify(items),
      itemCount: items.length
    });
  }

  static trackSearch(query: string, resultsCount: number) {
    UserBehaviorTracker.trackEvent('ecommerce', 'search', 'query', query, resultsCount);
  }

  static trackWishlistAdd(productId: string, productName: string) {
    UserBehaviorTracker.trackEvent('ecommerce', 'wishlist', 'add', productName, undefined, {
      productId
    });
  }

  static trackWishlistRemove(productId: string, productName: string) {
    UserBehaviorTracker.trackEvent('ecommerce', 'wishlist', 'remove', productName, undefined, {
      productId
    });
  }
}

// Error tracking
export class ErrorTracker {
  static trackError(error: Error, context: string, severity: 'low' | 'medium' | 'high' = 'medium') {
    UserBehaviorTracker.trackEvent('error', 'application', 'occurred', error.message, undefined, {
      errorName: error.name,
      errorStack: error.stack || '',
      context,
      severity,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  static trackApiError(endpoint: string, status: number, message: string) {
    UserBehaviorTracker.trackEvent('error', 'api', 'failed', endpoint, status, {
      endpoint,
      status,
      message
    });
  }
}

// User flow tracking
export class UserFlowTracker {
  private static currentFlow: string[] = [];
  private static flowStartTime: number = Date.now();

  static startFlow(flowName: string) {
    this.currentFlow = [flowName];
    this.flowStartTime = Date.now();
  }

  static addStep(stepName: string) {
    this.currentFlow.push(stepName);
  }

  static completeFlow(success: boolean = true) {
    const duration = Date.now() - this.flowStartTime;
    
    UserBehaviorTracker.trackEvent('user_flow', 'completion', success ? 'success' : 'failure', this.currentFlow.join(' > '), duration, {
      flow: this.currentFlow.join(' > '),
      duration,
      success
    });

    this.currentFlow = [];
  }

  static abandonFlow(reason?: string) {
    const duration = Date.now() - this.flowStartTime;
    
    UserBehaviorTracker.trackEvent('user_flow', 'abandonment', 'abandoned', this.currentFlow.join(' > '), duration, {
      flow: this.currentFlow.join(' > '),
      duration,
      reason: reason || ''
    });

    this.currentFlow = [];
  }
}

// Performance tracking
export class PerformanceTracker {
  static trackPageLoad(pageName: string) {
    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    UserBehaviorTracker.trackEvent('performance', 'page_load', 'complete', pageName, timing.loadEventEnd - timing.fetchStart, {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.fetchStart,
      firstByte: timing.responseStart - timing.fetchStart,
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart
    });
  }

  static trackApiCall(endpoint: string, method: string, duration: number, success: boolean) {
    UserBehaviorTracker.trackEvent('performance', 'api_call', success ? 'success' : 'failure', `${method} ${endpoint}`, duration);
  }

  static trackComponentRender(componentName: string, duration: number) {
    UserBehaviorTracker.trackEvent('performance', 'component', 'render', componentName, duration);
  }
}

// Real-time monitoring dashboard data
export class MonitoringDashboard {
  static getMetrics() {
    const events = UserBehaviorTracker.getEvents();
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(e => e.timestamp.getTime() > last24h);
    
    return {
      totalEvents: events.length,
      recentEvents: recentEvents.length,
      uniqueUsers: new Set(events.map(e => e.userId).filter(Boolean)).size,
      topEvents: this.getTopEvents(recentEvents),
      errorRate: this.getErrorRate(recentEvents),
      averageSessionDuration: this.getAverageSessionDuration(events),
      performanceMetrics: PerformanceMonitor.getMetrics()
    };
  }

  private static getTopEvents(events: AnalyticsEvent[]) {
    const eventCounts = events.reduce((acc, event) => {
      const key = `${event.category}.${event.action}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));
  }

  private static getErrorRate(events: AnalyticsEvent[]) {
    const errorEvents = events.filter(e => e.category === 'error');
    return events.length > 0 ? (errorEvents.length / events.length) * 100 : 0;
  }

  private static getAverageSessionDuration(events: AnalyticsEvent[]) {
    const sessions = new Map<string, { start: Date; end: Date }>();
    
    events.forEach(event => {
      if (event.sessionId && !sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, { start: event.timestamp, end: event.timestamp });
      } else if (event.sessionId) {
        const session = sessions.get(event.sessionId)!;
        if (event.timestamp < session.start) session.start = event.timestamp;
        if (event.timestamp > session.end) session.end = event.timestamp;
      }
    });

    const durations = Array.from(sessions.values()).map(s => s.end.getTime() - s.start.getTime());
    return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  }
}

// Initialize analytics
export function initializeAnalytics(userId?: string) {
  UserBehaviorTracker.startTracking(userId);
  PerformanceMonitor.startWebVitalsMonitoring();
  
  // Track initial page load
  PerformanceTracker.trackPageLoad(window.location.pathname);
  
  // Track errors globally
  window.addEventListener('error', (e) => {
    ErrorTracker.trackError(e.error, 'global');
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    ErrorTracker.trackError(new Error(e.reason), 'unhandled_promise');
  });
}
