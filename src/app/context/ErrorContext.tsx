"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ApiError } from "@/lib/api-types";
import ErrorDisplay from "@/app/components/ErrorDisplay";

type ErrorContextType = {
  error: Error | ApiError | null;
  setError: (error: Error | ApiError | null) => void;
  clearError: () => void;
  showError: (message: string, code?: string, statusCode?: number) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | ApiError | null>(null);

  const clearError = () => setError(null);

  const showError = (
    message: string,
    code = "client_error",
    statusCode = 400
  ) => {
    setError(new ApiError(message, statusCode, code, null));
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, showError }}>
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <ErrorDisplay
            error={error}
            actionText="Dismiss"
            onAction={clearError}
          />
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
