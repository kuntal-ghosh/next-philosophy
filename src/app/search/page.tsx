"use client";

import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/actions";
import { Product } from "@/lib/api-types";

export default function SearchPage() {
  const [state, action] = useFormState(searchProducts, {
    products: [],
    query: "",
  });

  return (
    <div className="search-page">
      <h1>Search Products</h1>

      <form action={action} className="search-form">
        <input
          type="text"
          name="query"
          placeholder="Search products..."
          defaultValue={state.query}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {state.error && <p className="error-message">{state.error}</p>}

      <div className="search-results">
        {state.products.length === 0 && state.query ? (
          <p>No products found for "{state.query}"</p>
        ) : state.products.length > 0 ? (
          <>
            <h2>Results for "{state.query}"</h2>
            <div className="product-grid">
              {state.products.map((product: Product) => (
                <a
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="product-card"
                >
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </a>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
