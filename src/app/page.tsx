
// export default async function Home() {
//   const id = 1;
//   // Fetch data from an API
//   const res = await fetch(`https://dummyjson.com/products/${id}`);
//   const product = await res.json();
//   return  <div>{product.title}</div>;
  
// }
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';

export default async function HomePage() {
  // Parallel data fetching with caching
  // const [featuredProducts, categories] = await Promise.all([
  //   getProducts('featured'), // Using the revalidate setting from the API function
  //   getCategories()
  // ]);
  
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
      
      {/* <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map(category => (
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
          {featuredProducts.map(product => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id}
              className="product-card"
            >
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section> */}
    </div>
  );
}