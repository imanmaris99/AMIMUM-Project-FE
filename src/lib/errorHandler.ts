// Comprehensive Error Handling System
import { toast } from 'react-hot-toast';
// import React from 'react'; // Removed unused import

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string | number;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string | number,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error classification
export function classifyError(error: any): ErrorType {
  if (error instanceof AppError) {
    return error.type;
  }

  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return ErrorType.NETWORK;
  }

  if (error.name === 'ValidationError' || error.message?.includes('validation')) {
    return ErrorType.VALIDATION;
  }

  if (error.status === 401 || error.message?.includes('unauthorized')) {
    return ErrorType.AUTHENTICATION;
  }

  if (error.status === 403 || error.message?.includes('forbidden')) {
    return ErrorType.AUTHORIZATION;
  }

  if (error.status >= 500 || error.message?.includes('server')) {
    return ErrorType.SERVER;
  }

  if (error.status >= 400) {
    return ErrorType.CLIENT;
  }

  return ErrorType.UNKNOWN;
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: {
    title: 'Koneksi Bermasalah',
    message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    action: 'Coba Lagi'
  },
  [ErrorType.VALIDATION]: {
    title: 'Data Tidak Valid',
    message: 'Mohon periksa kembali data yang Anda masukkan.',
    action: 'Perbaiki Data'
  },
  [ErrorType.AUTHENTICATION]: {
    title: 'Sesi Berakhir',
    message: 'Sesi Anda telah berakhir. Silakan login kembali.',
    action: 'Login Ulang'
  },
  [ErrorType.AUTHORIZATION]: {
    title: 'Akses Ditolak',
    message: 'Anda tidak memiliki izin untuk mengakses fitur ini.',
    action: 'Kembali'
  },
  [ErrorType.SERVER]: {
    title: 'Server Bermasalah',
    message: 'Terjadi kesalahan pada server. Tim kami sedang memperbaikinya.',
    action: 'Coba Lagi Nanti'
  },
  [ErrorType.CLIENT]: {
    title: 'Permintaan Tidak Valid',
    message: 'Permintaan Anda tidak dapat diproses.',
    action: 'Periksa Kembali'
  },
  [ErrorType.UNKNOWN]: {
    title: 'Terjadi Kesalahan',
    message: 'Terjadi kesalahan yang tidak terduga.',
    action: 'Coba Lagi'
  }
};

// Error handler with retry mechanism
export class ErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  static async handleError(
    error: any,
    context: string = 'Unknown',
    retryable: boolean = false,
    retryFunction?: () => Promise<any>
  ): Promise<void> {
    const errorType = classifyError(error);
    const errorInfo: ErrorInfo = {
      type: errorType,
      message: error.message || 'Unknown error',
      code: error.code || error.status,
      details: error.details || error,
      timestamp: new Date(),
      userId: localStorage.getItem('user_id') || undefined,
      sessionId: localStorage.getItem('session_id') || undefined,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log error for debugging

    // Send error to monitoring service (in production)
    await this.reportError(errorInfo);

    // Handle retry logic
    if (retryable && retryFunction && errorType === ErrorType.NETWORK) {
      const retryKey = `${context}-${errorInfo.url}`;
      const attempts = this.retryAttempts.get(retryKey) || 0;

      if (attempts < this.MAX_RETRIES) {
        this.retryAttempts.set(retryKey, attempts + 1);
        
        toast.loading(`Mencoba lagi... (${attempts + 1}/${this.MAX_RETRIES})`, {
          duration: this.RETRY_DELAY
        });

        setTimeout(async () => {
          try {
            await retryFunction();
            this.retryAttempts.delete(retryKey);
            toast.success('Berhasil dihubungkan kembali!');
          } catch (retryError) {
            await this.handleError(retryError, context, retryable, retryFunction);
          }
        }, this.RETRY_DELAY * (attempts + 1));
        
        return;
      }
    }

    // Show user-friendly error message
    const errorConfig = ERROR_MESSAGES[errorType];
    toast.error(`${errorConfig.title}: ${errorConfig.message}`, {
      duration: 5000
    });
  }

  private static async reportError(errorInfo: ErrorInfo): Promise<void> {
    try {
      // In production, send to monitoring service like Sentry
      if (process.env.NODE_ENV === 'production') {
        // await sentry.captureException(errorInfo);
      }
    } catch (reportError) {
    }
  }

  private static handleErrorAction(errorType: ErrorType, errorInfo: ErrorInfo): void {
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
        // Redirect to login
        window.location.href = '/login';
        break;
      case ErrorType.NETWORK:
        // Refresh page
        window.location.reload();
        break;
      case ErrorType.VALIDATION:
        // Focus on first error field
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) {
          (firstErrorField as HTMLElement).focus();
        }
        break;
      default:
        // Show error details in console for debugging
    }
  }

  static clearRetryAttempts(): void {
    this.retryAttempts.clear();
  }
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Error boundary moved to ClientErrorBoundary component

// Utility for handling async operations with error handling
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string = 'Unknown',
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    await ErrorHandler.handleError(error, context);
    return fallback;
  }
}
