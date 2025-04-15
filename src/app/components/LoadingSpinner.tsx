// app/components/LoadingSpinner.tsx
"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="ml-2">Searching...</span>
    </div>
  );
}