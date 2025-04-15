/**
 * Feature: Product Search Component
 * Description: A client-side component that provides product search functionality
 * using Server Actions with URL synchronization to enable shareable search results.
 */

"use client";

import { searchProducts } from "@lib/actions";
import { SearchState } from "@lib/api";
import { useEffect, useState, useRef } from "react";
import { useFormState } from "react-dom";
import { startTransition } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Step 1: Define types and initialize constants
const initialState: SearchState = {
  products: [],
  isLoading: false,
  query: "",
};

export default function SearchForm() {
  // Step 2: Set up hooks and state
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  // Connect to server action using useFormState
  const [state, formAction] = useFormState(searchProducts, initialState);
  
  // Local state for tracking UI loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reference to form element for programmatic submission
  const formRef = useRef<HTMLFormElement>(null);
  
  // Step 3: Implement URL synchronization and automatic search
  useEffect(() => {
    // Defensive programming: Ensure searchParams exists
    if (!searchParams) return;
    
    // Extract query parameter from URL
    const queryParam = searchParams.get("query") || "";
    
    // Only trigger search if there's a query in URL but no search results yet
    if (queryParam && !state.query && !isSubmitting) {
      // Set loading state
      setIsSubmitting(true);
      
      // Programmatically trigger form submission with URL parameter
      const form = formRef.current;
      if (form) {
        const input = form.querySelector('input[name="query"]') as HTMLInputElement;
        if (input) {
          // Update input value to match URL
          input.value = queryParam;
          
          // Use startTransition to mark this as a non-urgent update
          startTransition(() => {
            form.requestSubmit();
          });
        }
      }
    }
    
    // Reset loading state when search completes
    if (isSubmitting && state.query) {
      setIsSubmitting(false);
    }
  }, [searchParams, state, isSubmitting]);
  
  // Step 4: Handle form submission and URL updates
  /**
   * Handles form submission by:
   * 1. Validating search query
   * 2. Updating URL parameters for shareability
   * 3. Setting loading state for UI feedback
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Extract query from form data
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    
    // Defensive programming: Prevent empty searches
    if (!query || !query.trim()) {
      e.preventDefault(); // Prevent form submission
      return;
    }
    
    // Set loading state for UI feedback
    setIsSubmitting(true);
    
    // Update URL for shareability while handling potential errors
    try {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("query", query.trim());
      replace(`${pathname}?${params.toString()}`);
    } catch (error) {
      // Log error but continue with search
      console.error("Error updating URL:", error);
    }
  };
  
  // Step 5: Render UI components
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Search</h1>
      
      {/* Search form */}
      <form 
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="mb-8"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            placeholder="Search products..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={searchParams?.get("query") || ""}
            aria-label="Search query"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Loading indicator */}
      {isSubmitting && <LoadingSpinner />}
      
      {/* Error message display */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6" role="alert">
          {state.error}
        </div>
      )}
      
      {/* Results display */}
      {!isSubmitting && state.products && state.products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Found {state.products.length} results for &quot;{state.query}&quot;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      {/* No results state */}
      {!isSubmitting && state.query && (!state.products || state.products.length === 0) && !state.error && (
        <div className="text-center py-8 text-gray-500">
          No products found for &quot;{state.query}&quot;. Try a different search term.
        </div>
      )}
    </div>
  );
}

/**
 * Summary:
 * 1. Set up form with Server Action integration using useFormState
 * 2. Implemented URL synchronization for shareable search results
 * 3. Added automatic search initialization from URL parameters
 * 4. Implemented error handling and loading states
 * 5. Created responsive UI for search results with proper error states
 * 
 * Performance considerations:
 * - Used startTransition to mark non-urgent updates
 * - Implemented controlled re-renders with specific dependency arrays
 * - Used uncontrolled form inputs to reduce state updates
 * 
 * Security considerations:
 * - Sanitized user input by trimming search queries
 * - Used encodeURIComponent in the server action (not shown here)
 * - Prevented empty search submissions
 * 
 * Next steps:
 * - Add debouncing for search input to reduce unnecessary searches
 * - Implement search filtering options (category, price range, etc.)
 * - Add keyboard shortcuts for improved accessibility (e.g., "/" to focus search)
 * - Consider adding search analytics to track popular searches
 */