"use server";

import { Product, SearchState } from "./api";

export async function searchProducts(
  _prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  // console.log("🚀 ~ _prevState:", _prevState)
  
  // Extract query from form data
  const query = formData.get("query") as string;
  
  // Return early if empty query
  if (!query.trim()) {
    return {
      products: [],
      isLoading: false,
      query: "",
    };
  }
  
  try {
    // Fetch products from API
    console.log("🚀 ~ query:", query)
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    
    // Handle API errors
    if (!res.ok) {
      throw new Error(`Search failed with status ${res.status}`);
    }
    
    // Parse API response
    const data = await res.json();
    
    // Return the new state
    return {
      products: data.products,
      isLoading: false,
      query,
    };
  } catch (error) {
    // Handle and return errors
    console.error("Search error:", error);
    return {
      products: [],
      isLoading: false,
      error: "Failed to search products. Please try again.",
      query,
    };
  }
}