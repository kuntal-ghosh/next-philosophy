/**
 * Feature: Homepage Loading UI
 * Description: Skeleton loader for the homepage while data is being fetched
 */

export default function HomeLoading() {
  return (
    <div className="home-page">
      {/* Step 1: Hero section skeleton */}
      <section className="hero-skeleton animate-pulse">
        <div className="hero-content">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-8"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-40 mx-auto"></div>
        </div>
      </section>
      
      {/* Step 2: Categories section skeleton */}
      <section className="categories">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-8"></div>
        <div className="category-grid">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </section>
      
      {/* Step 3: Featured products section skeleton */}
      <section className="featured-products">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-8"></div>
        <div className="product-grid">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Summary:
 * 1. Created skeleton loaders for each section of the homepage
 * 2. Used animation to indicate loading state
 * 3. Maintained the same layout structure as the actual page
 * 4. Applied responsive design principles to match the main component
 * 
 * Performance considerations:
 * - Used simple div elements rather than complex components for better render performance
 * - Leveraged Tailwind's animate-pulse for a standardized loading animation
 * 
 * Accessibility considerations:
 * - Loading UI maintains the same structure as the final content, reducing layout shifts
 */