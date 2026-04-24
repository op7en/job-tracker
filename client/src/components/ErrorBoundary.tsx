import React, { Component, type ReactNode } from "react";
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // сюда можно позже прикрутить Sentry / логирование
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-app)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "16px",
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}
            >
              An unexpected error occurred. Try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  background: "var(--bg-elevated)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "var(--danger)",
                  textAlign: "left",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
