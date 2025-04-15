import React, { Suspense } from "react";
import { ApiError } from "@/lib/api-types";
import ErrorDisplay from "@/app/components/ErrorDisplay";

interface AsyncDataProps<T> {
  loader: () => Promise<T>;
  children: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: (error: unknown, retry: () => void) => React.ReactNode;
}

/**
 * A wrapper component for safely handling async data fetching
 * with proper loading, error states, and retry functionality
 */
function AsyncData<T>({
  loader,
  children,
  fallback = <div>Loading...</div>,
  errorFallback,
}: AsyncDataProps<T>) {
  return (
    <Suspense fallback={fallback}>
      <AsyncDataInner loader={loader} errorFallback={errorFallback}>
        {children}
      </AsyncDataInner>
    </Suspense>
  );
}

interface AsyncDataInnerProps<T> extends Omit<AsyncDataProps<T>, "fallback"> {}

function AsyncDataInner<T>({
  loader,
  children,
  errorFallback,
}: AsyncDataInnerProps<T>) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      console.error("AsyncData error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle retry
  const handleRetry = React.useCallback(() => {
    loadData();
  }, [loadData]);

  // Show error state if there's an error
  if (error) {
    // Use custom error fallback if provided
    if (errorFallback) {
      return <>{errorFallback(error, handleRetry)}</>;
    }

    // Default error display
    return (
      <ErrorDisplay error={error} actionText="Retry" onAction={handleRetry} />
    );
  }

  // Show loading state if still loading
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  // Render the children with the data
  return <>{children(data)}</>;
}

export default AsyncData;
