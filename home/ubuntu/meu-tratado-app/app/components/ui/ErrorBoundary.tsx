'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="card max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops, algo deu errado!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {this.state.error?.message || 'Um erro inesperado ocorreu.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}