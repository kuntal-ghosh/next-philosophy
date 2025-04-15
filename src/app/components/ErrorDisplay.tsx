import React from "react";
import { ApiError } from "@/lib/api-types";

interface ErrorDisplayProps {
  error: Error | ApiError | unknown;
  actionText?: string;
  onAction?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  actionText = "Try Again",
  onAction,
}) => {
  // Format the error message based on the error type
  const formatError = (err: unknown) => {
    if (err instanceof ApiError) {
      return {
        title: getErrorTitle(err.statusCode),
        message: err.message,
        code: err.code,
        details:
          process.env.NODE_ENV === "development" ? err.details : undefined,
      };
    } else if (err instanceof Error) {
      return {
        title: "An error occurred",
        message: err.message,
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      };
    } else {
      return {
        title: "Unknown Error",
        message: "An unexpected error occurred",
      };
    }
  };

  const getErrorTitle = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 409:
        return "Conflict";
      case 500:
        return "Server Error";
      default:
        return `Error (${statusCode})`;
    }
  };

  const { title, message, code, details } = formatError(error);

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          {/* Error icon */}
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
            {code && (
              <p className="mt-1 text-xs text-red-600">Error code: {code}</p>
            )}
            {details && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">
                  View details
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto bg-red-100 p-2 rounded">
                  {typeof details === "string"
                    ? details
                    : JSON.stringify(details, null, 2)}
                </pre>
              </details>
            )}
          </div>
          {onAction && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {actionText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
