import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';

/**
 * Feature: E-commerce Homepage
 * Description: Main landing page displaying featured products and categories
 */

export default async function HomePage() {
  // Step 1: Fetch data in parallel with appropriate caching
  const [featuredProducts, categories] = await Promise.all([
    getProducts('featured'), // Using the revalidate setting from the API function
    getCategories()
  ]);

     // Validate that we have arrays to prevent mapping errors
     const validProducts = Array.isArray(featuredProducts) ? featuredProducts : [];
     const validCategories = Array.isArray(categories) ? categories : [];
  
  return (
    <div className="home-page">
      {/* Step 2: Hero section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link href="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </section>
      
      {/* Step 3: Categories section */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {validCategories.map(category => (
            <Link 
              href={`/products?category=${category.id}`}
              key={category.id}
              className="category-card"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
      
      {/* Step 4: Featured products section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {validProducts.map(product => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id}
              className="product-card"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="product-image" 
              />
              <h3>{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Summary:
 * 1. Implemented parallel data fetching for products and categories
 * 2. Created a responsive homepage with three main sections:
 *    - Hero banner with call-to-action
 *    - Category navigation grid
 *    - Featured products showcase
 * 3. Used proper error handling via the API functions
 * 4. Applied caching strategies (3600s for products, 86400s for categories)
 * 
 * Performance considerations:
 * - Parallel data fetching reduces loading time
 * - Caching strategies reduce database load and improve response times
 * 
 * Next steps:
 * - Add loading states for each section
 * - Implement image optimization with next/image
 * - Add skeleton loaders for better UX during data fetching
 */