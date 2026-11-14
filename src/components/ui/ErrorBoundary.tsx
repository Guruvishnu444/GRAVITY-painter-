import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GRAVITY PAINTER Uncaught Exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-zen-bg p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-neumorph max-w-md w-full">
            <h2 className="text-xl font-bold text-red-500 mb-2">Simulation Encountered an Issue</h2>
            <p className="text-sm text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred in the canvas renderer.'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-ink-static text-white font-medium rounded-full shadow-md hover:bg-ink-static-light transition-all"
            >
              Restart Simulation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
