import "server-only";

// Product types
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  userName: string;
};

export type Category = {
  id: string;
  name: string;
};

// API functions
export async function getProducts(categoryId?: string) {
  const url = categoryId 
    ? `${process.env.API_URL}/products?categoryId=${categoryId}`
    : `${process.env.API_URL}/products`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) throw new Error("Failed to fetch products");
  
  return res.json() as Promise<Product[]>;
}

export async function getProduct(id: string) {
  const res = await fetch(`${process.env.API_URL}/products/${id}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  
  return res.json() as Promise<Product>;
}

export async function getProductReviews(productId: string) {
  const res = await fetch(`${process.env.API_URL}/products/${productId}/reviews`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) throw new Error("Failed to fetch reviews");
  
  return res.json() as Promise<Review[]>;
}

export async function getRelatedProducts(productId: string) {
  const res = await fetch(`${process.env.API_URL}/products/${productId}/related`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) throw new Error("Failed to fetch related products");
  
  return res.json() as Promise<Product[]>;
}

export async function getCategories() {
  const res = await fetch(`${process.env.API_URL}/categories`, {
    next: { revalidate: 86400 } // Cache for a day
  });
  
  if (!res.ok) throw new Error("Failed to fetch categories");
  
  return res.json() as Promise<Category[]>;
}