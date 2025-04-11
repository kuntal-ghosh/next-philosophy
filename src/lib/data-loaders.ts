import DataLoader from 'dataloader';
import { cache } from 'react';
import { Category } from './api';

// Batch function to get multiple categories at once
async function batchGetCategories(categoryIds: readonly string[]) {
  console.log('Batch loading categories:', categoryIds);
  
  // Query that accepts multiple IDs
  const queryString = categoryIds.map(id => `id=${id}`).join('&');
  const res = await fetch(`${process.env.API_URL}/categories?${queryString}`);
  
  if (!res.ok) throw new Error('Failed to load categories');
  
  const categories = await res.json() as Category[];
  
  // Important: Return results in the same order as the input IDs
  return categoryIds.map(id => 
    categories.find(category => category.id === id) || null
  );
}

// Create a new loader per request
export const getCategoryLoader = cache(() => 
  new DataLoader(batchGetCategories)
);

// Wrapper function to use in components
export async function getCategory(id: string) {
  const loader = getCategoryLoader();
  return loader.load(id);
}