import {
  createSuccessResponse,
  withErrorHandling,
} from "@/lib/api/errorHandler";
import prisma from "@/prisma/client";

export const GET = withErrorHandling(async (request: Request) => {
  const products = await prisma.product.findMany();
  return createSuccessResponse(products, 200, "products.fetchSuccess");
});

export const POST = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { name, price, description, stock } = data;

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      stock,
    },
  });

  return createSuccessResponse(product, 201, "products.createSuccess");
});

export const PUT = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { id, name, price, description, stock } = data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      description,
      stock,
    },
  });

  return createSuccessResponse(product, 200, "products.updateSuccess");
});

export const DELETE = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { id } = data;

  const product = await prisma.product.delete({
    where: { id },
  });

  return createSuccessResponse(product, 200, "products.deleteSuccess");
});
