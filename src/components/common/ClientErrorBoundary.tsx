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

  componentDidCatch() {
    // Log error for debugging
    // Error caught by ClientErrorBoundary
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
  // Use error parameter for display
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  return React.createElement(
    'div',
    { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
    React.createElement(
      'div',
      { className: 'text-center' },
      React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 mb-4' }, 'Oops! Something went wrong'),
      React.createElement('p', { className: 'text-gray-600 mb-4' }, errorMessage),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        className: 'bg-primary text-white px-4 py-2 rounded hover:bg-primary/90'
      }, 'Reload Page')
    )
  );
}
