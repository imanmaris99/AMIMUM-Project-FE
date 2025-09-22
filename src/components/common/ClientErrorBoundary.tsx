"use client";

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ClientErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent, { error: this.state.error! });
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ error }: { error: Error }) {
  return React.createElement(
    'div',
    { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full bg-white shadow-lg rounded-lg p-6' },
      React.createElement(
        'div',
        { className: 'flex items-center mb-4' },
        React.createElement(
          'div',
          { className: 'flex-shrink-0' },
          React.createElement(
            'svg',
            { className: 'h-8 w-8 text-red-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'ml-3' },
          React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, 'Terjadi Kesalahan')
        )
      ),
      React.createElement(
        'div',
        { className: 'mt-2' },
        React.createElement(
          'p',
          { className: 'text-sm text-gray-500' },
          'Aplikasi mengalami masalah. Silakan refresh halaman atau coba lagi nanti.'
        )
      ),
      React.createElement(
        'div',
        { className: 'mt-4' },
        React.createElement(
          'button',
          {
            onClick: () => window.location.reload(),
            className: 'bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'
          },
          'Refresh Halaman'
        )
      )
    )
  );
}
