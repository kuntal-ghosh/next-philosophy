import { getProducts } from '@/lib/api';
import { getCategory } from '@/lib/data-loaders';

export default async function ProductsPage() {
  const products = await getProducts();
       // Validate that we have arrays to prevent mapping errors
       const validProducts = Array.isArray(products) ? products : [];
    
  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="product-grid">
        {validProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Using DataLoader to avoid N+1 queries for categories
async function ProductCard({ product }: { product: any }) {
  // This will be batched with other category requests
  const category = await getCategory(product.categoryId);
  
  return (
    <a href={`/products/${product.id}`} className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">{category?.name}</p>
        <p className="price">${product.price.toFixed(2)}</p>
      </div>
    </a>
  );
}