import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw, Home, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleDismiss = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
              </div>
              <button 
                onClick={this.handleDismiss}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                The application encountered an unexpected error. You can try the following:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Refresh the page</li>
                <li>Clear your browser cache</li>
                <li>Return to the dashboard</li>
              </ul>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details (Development Only)</h3>
                  <p className="font-mono text-sm text-red-600 break-all mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Link
                to="/"
                onClick={this.handleDismiss}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;