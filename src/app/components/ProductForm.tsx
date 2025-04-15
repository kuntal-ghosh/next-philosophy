"use client";

import React, { useState } from "react";
import { useClientAction } from "@/app/hooks/useClientAction";
import { useError } from "@/app/context/ErrorContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { ApiResponse, Product } from "@/lib/api-types";

// Mock function that would normally call your API
async function createProduct(
  productData: Partial<Product>
): Promise<ApiResponse<Product>> {
  // Replace with actual API call in a real implementation
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return response.json();
}

export default function ProductForm() {
  const { showError } = useError();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  const {
    execute: submitProduct,
    isLoading,
    isError,
    error,
    isSuccess,
    reset,
  } = useClientAction<Product, Partial<Product>>(createProduct, {
    onSuccess: () => {
      // Clear form after success
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
    },
    // Prevent global error display since we'll handle it in the component
    showGlobalError: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      // Use the error context to show validation errors
      showError("Name and price are required fields", "validation_error");
      return;
    }

    try {
      await submitProduct({
        name,
        price: parseFloat(price),
        description,
        stock: parseInt(stock || "0"),
      });
    } catch (err) {
      // Error is already handled by useClientAction
      console.log("Form submission failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Product successfully created!
        </div>
      )}

      {isError && error && (
        <ErrorDisplay error={error} actionText="Try Again" onAction={reset} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-1 font-medium">
            Price *
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="stock" className="block mb-1 font-medium">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded text-white font-medium ${
            isLoading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Submitting..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
