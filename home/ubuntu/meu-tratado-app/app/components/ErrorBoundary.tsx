'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro na aplicação:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl text-red-600 mb-4">Ops! Algo deu errado.</h2>
          <button
            className="nav-button"
            onClick={() => this.setState({ hasError: false })}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}