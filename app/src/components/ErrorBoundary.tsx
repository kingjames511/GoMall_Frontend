import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-bg px-4">
          <div className="max-w-md w-full text-center card-surface p-8 md:p-12">
            <div className="w-14 h-14 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-6 text-2xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold text-text-primary mb-2 leading-tight">
              Something went wrong
            </h1>

            <p className="text-sm text-text-muted mb-8 leading-relaxed">
              An unexpected error occurred. Please reload the page or try again later.
            </p>

            <button
              onClick={this.handleReload}
              className="btn btn-primary px-8"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
