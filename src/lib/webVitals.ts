// Web Vitals Monitoring
// Comprehensive performance monitoring for production

interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, parameters: Record<string, unknown>) => void;
}

export interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export interface WebVitalReport {
  metric: WebVitalMetric;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: number;
  timestamp: number;
}

class WebVitalsMonitor {
  private metrics: Map<string, WebVitalMetric> = new Map();
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    this.setupCoreWebVitals();
    this.setupCustomMetrics();
    this.setupErrorTracking();
  }

  private setupCoreWebVitals() {
    // LCP - Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entry) => {
      const lcp = entry as PerformanceEntry;
      this.reportMetric({
        name: 'LCP',
        value: lcp.startTime,
        delta: lcp.startTime,
        id: this.generateId(),
        navigationType: 'navigate'
      });
    });

    // FID - First Input Delay
    this.observeMetric('first-input', (entry) => {
      const fid = entry as PerformanceEventTiming;
      this.reportMetric({
        name: 'FID',
        value: fid.processingStart - fid.startTime,
        delta: fid.processingStart - fid.startTime,
        id: this.generateId(),
        navigationType: 'navigate'
      });
    });

    // CLS - Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      const cls = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
      if (!cls.hadRecentInput) {
        this.reportMetric({
          name: 'CLS',
          value: cls.value,
          delta: cls.value,
          id: this.generateId(),
          navigationType: 'navigate'
        });
      }
    });

    // FCP - First Contentful Paint
    this.observeMetric('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.reportMetric({
          name: 'FCP',
          value: entry.startTime,
          delta: entry.startTime,
          id: this.generateId(),
          navigationType: 'navigate'
        });
      }
    });
  }

  private setupCustomMetrics() {
    // TTFB - Time to First Byte
    this.observeMetric('navigation', (entry) => {
      const nav = entry as PerformanceNavigationTiming;
      this.reportMetric({
        name: 'TTFB',
        value: nav.responseStart - nav.requestStart,
        delta: nav.responseStart - nav.requestStart,
        id: this.generateId(),
        navigationType: 'navigate'
      });
    });

    // Resource Loading Times
    this.observeMetric('resource', (entry) => {
      const resource = entry as PerformanceResourceTiming;
      if (resource.initiatorType === 'img') {
        this.reportMetric({
          name: 'IMAGE_LOAD_TIME',
          value: resource.responseEnd - resource.requestStart,
          delta: resource.responseEnd - resource.requestStart,
          id: this.generateId(),
          navigationType: 'navigate'
        });
      }
    });
  }

  private setupErrorTracking() {
    // JavaScript Errors
    window.addEventListener('error', (/* event */) => {
      this.reportMetric({
        name: 'JS_ERROR',
        value: 1,
        delta: 1,
        id: this.generateId(),
        navigationType: 'navigate'
      });
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (/* event */) => {
      this.reportMetric({
        name: 'PROMISE_REJECTION',
        value: 1,
        delta: 1,
        id: this.generateId(),
        navigationType: 'navigate'
      });
    });
  }

  private observeMetric(entryType: string, callback: (entry: PerformanceEntry) => void) {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch {
      // Failed to observe entry type - continuing without monitoring
    }
  }

  private reportMetric(metric: WebVitalMetric) {
    this.metrics.set(metric.name, metric);
    
    const report: WebVitalReport = {
      metric,
      rating: this.getRating(metric.name, metric.value),
      threshold: this.getThreshold(metric.name),
      timestamp: Date.now()
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // Web Vitals monitoring in development mode
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(report);
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private getThreshold(name: string): number {
    const thresholds = {
      'LCP': 2500,
      'FID': 100,
      'CLS': 0.1,
      'FCP': 1800,
      'TTFB': 800
    };

    return thresholds[name as keyof typeof thresholds] || 0;
  }

  private sendToAnalytics(report: WebVitalReport) {
    // Send to Google Analytics 4
    const windowWithGtag = window as WindowWithGtag;
    if (typeof windowWithGtag.gtag !== 'undefined') {
      windowWithGtag.gtag('event', 'web_vitals', {
        metric_name: report.metric.name,
        metric_value: report.metric.value,
        metric_rating: report.rating,
        metric_delta: report.metric.delta,
        metric_id: report.metric.id
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }).catch(() => {
        // Failed to send Web Vitals to analytics
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getMetrics(): Map<string, WebVitalMetric> {
    return new Map(this.metrics);
  }

  getMetric(name: string): WebVitalMetric | undefined {
    return this.metrics.get(name);
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  webVitalsMonitor.init();
}

// Export for manual initialization
export default webVitalsMonitor;
