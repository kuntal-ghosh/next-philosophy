import { Suspense } from 'react';
import { getProduct, getProductReviews, getRelatedProducts } from '@/lib/api';

// Component decomposition for parallel data fetching
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="product-page">
      <ProductDetails id={params.id} />
      <div className="product-sections">
        <Suspense fallback={<p>Loading reviews...</p>}>
          <ProductReviews id={params.id} />
        </Suspense>
        <Suspense fallback={<p>Loading related products...</p>}>
          <RelatedProducts id={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Each component fetches its own data in parallel
async function ProductDetails({ id }: { id: string }) {
  const product = await getProduct(id);
  
  return (
    <div className="product-main">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
}

async function ProductReviews({ id }: { id: string }) {
  const reviews = await getProductReviews(id);
  
  return (
    <div className="product-reviews">
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map(review => (
            <li key={review.id} className="review">
              <div className="review-header">
                <span className="review-name">{review.userName}</span>
                <span className="review-rating">Rating: {review.rating}/5</span>
              </div>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const products = await getRelatedProducts(id);
  
  return (
    <div className="related-products">
      <h2>You Might Also Like</h2>
      <div className="product-grid">
        {products.map(product => (
          <a href={`/products/${product.id}`} key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}