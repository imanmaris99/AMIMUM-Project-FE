// Error Tracking and Analytics
// Comprehensive error monitoring for production

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
  errorType: 'javascript' | 'promise' | 'resource' | 'network' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface PerformanceReport {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userId?: string;
  sessionId: string;
  context?: Record<string, any>;
}

class ErrorTracker {
  private sessionId: string;
  private userId?: string;
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceReport[] = [];
  private isInitialized = false;
  private maxQueueSize = 50;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    this.setupErrorListeners();
    this.setupPerformanceListeners();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorListeners() {
    // JavaScript Errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        errorType: 'javascript',
        severity: this.getSeverity(event.error),
        context: {
          type: event.type,
          target: event.target?.constructor?.name
        }
      });
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        errorType: 'promise',
        severity: this.getSeverity(event.reason),
        context: {
          reason: event.reason,
          type: event.type
        }
      });
    });

    // Resource Loading Errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError({
          message: `Resource loading failed: ${(event.target as any)?.src || (event.target as any)?.href}`,
          url: (event.target as any)?.src || (event.target as any)?.href || window.location.href,
          errorType: 'resource',
          severity: 'medium',
          context: {
            tagName: (event.target as any)?.tagName,
            type: event.type
          }
        });
      }
    }, true);

    // Network Errors
    window.addEventListener('offline', () => {
      this.captureError({
        message: 'Network connection lost',
        url: window.location.href,
        errorType: 'network',
        severity: 'medium',
        context: {
          type: 'offline'
        }
      });
    });

    window.addEventListener('online', () => {
      this.captureError({
        message: 'Network connection restored',
        url: window.location.href,
        errorType: 'network',
        severity: 'low',
        context: {
          type: 'online'
        }
      });
    });
  }

  private setupPerformanceListeners() {
    // Long Task Detection
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.capturePerformance({
                name: 'LONG_TASK',
                value: entry.duration,
                context: {
                  startTime: entry.startTime,
                  name: entry.name
                }
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Failed to observe long tasks:', error);
      }
    }
  }

  private getSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'medium';
    
    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';
    
    // Critical errors
    if (message.includes('chunk') || message.includes('loading') || 
        message.includes('network') || message.includes('timeout')) {
      return 'critical';
    }
    
    // High severity errors
    if (message.includes('uncaught') || message.includes('reference') ||
        message.includes('type') || message.includes('syntax')) {
      return 'high';
    }
    
    // Medium severity errors
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'medium';
    }
    
    return 'low';
  }

  captureError(errorData: Partial<ErrorReport>) {
    const report: ErrorReport = {
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      url: errorData.url || window.location.href,
      lineNumber: errorData.lineNumber,
      columnNumber: errorData.columnNumber,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      userId: this.userId,
      sessionId: this.sessionId,
      errorType: errorData.errorType || 'custom',
      severity: errorData.severity || 'medium',
      context: errorData.context
    };

    this.errorQueue.push(report);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Tracker]', report);
    }

    // Flush if queue is full
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }
  }

  capturePerformance(performanceData: Partial<PerformanceReport>) {
    const report: PerformanceReport = {
      name: performanceData.name || 'UNKNOWN',
      value: performanceData.value || 0,
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      context: performanceData.context
    };

    this.performanceQueue.push(report);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance Tracker]', report);
    }

    // Flush if queue is full
    if (this.performanceQueue.length >= this.maxQueueSize) {
      this.flushPerformance();
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flushErrors();
      this.flushPerformance();
    }, this.flushInterval);
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendToEndpoint('/api/errors', { errors });
    } catch (error) {
      console.warn('Failed to send error reports:', error);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private async flushPerformance() {
    if (this.performanceQueue.length === 0) return;

    const performance = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      await this.sendToEndpoint('/api/performance', { performance });
    } catch (error) {
      console.warn('Failed to send performance reports:', error);
      // Re-add performance to queue for retry
      this.performanceQueue.unshift(...performance);
    }
  }

  private async sendToEndpoint(endpoint: string, data: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Error Tracker] Sending to ${endpoint}:`, data);
      return;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Manual error reporting
  reportError(error: Error, context?: Record<string, any>) {
    this.captureError({
      message: error.message,
      stack: error.stack,
      errorType: 'custom',
      severity: 'medium',
      context
    });
  }

  // Manual performance reporting
  reportPerformance(name: string, value: number, context?: Record<string, any>) {
    this.capturePerformance({
      name,
      value,
      context
    });
  }

  // Get current session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      errorCount: this.errorQueue.length,
      performanceCount: this.performanceQueue.length
    };
  }

  // Force flush all data
  async flush() {
    await Promise.all([
      this.flushErrors(),
      this.flushPerformance()
    ]);
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
    this.isInitialized = false;
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Export for manual use
export default errorTracker;
