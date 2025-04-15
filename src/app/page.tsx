import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/lib/api-types";

export default async function HomePage() {
  // Parallel data fetching with caching
  const [featuredProducts, categoriesResponse] = await Promise.all([
    getProducts("featured"), // Using the revalidate setting from the API function
    getCategories(),
  ]);
  console.log("🚀 ~ HomePage ~ featuredProducts:", featuredProducts);
  console.log("🚀 ~ HomePage ~ categories:", categoriesResponse);

  // Ensure categories is an array before mapping
  const categories: Category[] = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : [];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link href="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category: Category) => (
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

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {featuredProducts.map((product: Product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="product-card"
            >
              {/* Replace with proper image or placeholder */}
              <div className="product-image-placeholder">
                {product.name.charAt(0)}
              </div>
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
