import { withErrorHandling } from "@/lib/api/errorHandler";
import prisma from "@/prisma/client";
import { createSuccessResponse } from "@/lib/api/errorHandler";

export const GET = withErrorHandling(async (request: Request) => {
  const categories = await prisma.category.findMany();
  return createSuccessResponse(categories, 200, "categories.fetchSuccess");
});

export const POST = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { name } = data;

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return createSuccessResponse(category, 201, "categories.createSuccess");
});

export const PUT = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { id, name } = data;

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
    },
  });

  return createSuccessResponse(category, 200, "categories.updateSuccess");
});

export const DELETE = withErrorHandling(async (request: Request) => {
  const data = await request.json();
  const { id } = data;

  const category = await prisma.category.delete({
    where: { id },
  });

  return createSuccessResponse(category, 200, "categories.deleteSuccess");
});
