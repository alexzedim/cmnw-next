"use client";

import type { ReactNode } from "react";

import { Component } from "react";
import { useI18n } from "@/lib/i18n/context";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("[ErrorBoundary] Caught error:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="section container mx-auto px-6">
            <div className="card-surface p-6 rounded-lg border border-red-500/20 bg-red-500/5">
              <h2 className="text-lg font-semibold text-red-400 mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-foreground/60">
                {this.state.error?.message ||
                  "An unexpected error occurred. Please try refreshing the page."}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
