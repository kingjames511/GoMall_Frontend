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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 text-2xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              Something went wrong
            </h1>

            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              An unexpected error occurred. Please reload the page or try again later.
            </p>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center bg-[#0B2D6E] hover:bg-[#091f50] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors duration-200 shadow-sm cursor-pointer"
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
