import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Oops! Something went wrong.</h1>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
