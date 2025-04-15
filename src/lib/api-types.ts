// Client-safe API types and interfaces
// This file can be imported by both client and server components

// Common API Response Type
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    locale?: string;
    count?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
  error?: {
    code: string;
    errors?: any;
    details?: string;
  };
};

// Product types
export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: Date;
};

export type Category = {
  id?: number;
  name: string;
};

export type Review = {
  id?: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
};

// Error handling class for client-side API errors
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
