import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 font-body text-primary">
          <p className="text-lg font-headline font-bold">Something went wrong</p>
          <p className="mt-2 max-w-md text-center text-sm text-slate-600">
            The app hit an unexpected error. Try refreshing the page. If it keeps happening, clear site data for this
            domain and reload.
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-primary-container px-6 py-2 text-sm font-bold text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
