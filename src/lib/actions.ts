"use server";

import { Product } from './api';

export async function searchProducts(
  prevState: { products: Product[], query: string },
  formData: FormData
) {
  const query = formData.get('query') as string;
  
  if (!query) {
    return { products: [], query: '' };
  }
  
  const res = await fetch(`${process.env.API_URL}/products/search?q=${encodeURIComponent(query)}`);
  
  if (!res.ok) {
    return { 
      products: [], 
      query,
      error: 'Failed to search products'
    };
  }
  
  const products = await res.json();
  
  return { products, query };
}