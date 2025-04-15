// app/components/ProductCard.tsx
import { Product } from "@lib/api";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.categoryId}</p>
        <p className="text-gray-700 text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
}