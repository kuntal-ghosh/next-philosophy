import { NextRequest } from "next/server";
import { UserSchema } from "./schema";
import prisma from "@/prisma/client";
import {
  handleValidationError,
  handleDatabaseError,
  handleNotFoundError,
  handleConflictError,
  createSuccessResponse,
  withErrorHandling,
} from "@/lib/api/errorHandler";

// Use the withErrorHandling wrapper for global error handling
export const GET = withErrorHandling(async (request: NextRequest) => {
  const users = await prisma.user.findMany();
  return createSuccessResponse(users, 200, "users.fetchSuccess");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const data = await request.json();
  const parsedData = UserSchema.safeParse(data);

  if (!parsedData.success) {
    return handleValidationError(parsedData.error, "users.invalidData");
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedData.data.email },
  });

  if (existingUser) {
    return handleConflictError(`users.emailExists`);
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      name: parsedData.data.name,
      email: parsedData.data.email,
      followers: parsedData.data.followers,
      following: parsedData.data.following,
      createdAt: parsedData.data.createdAt || new Date(),
      isActive: parsedData.data.isActive,
    },
  });

  return createSuccessResponse(user, 201, "users.createSuccess");
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const data = await request.json();
  const parsedData = UserSchema.safeParse(data);

  if (!parsedData.success) {
    return handleValidationError(
      parsedData.error,
      "Invalid user data provided"
    );
  }

  const { id, name, email, createdAt, isActive } = parsedData.data;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      createdAt,
      isActive,
    },
  });

  return createSuccessResponse(user, 200, "users.updateSuccess");
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const data = await request.json();

  if (!data.id) {
    throw new Error("User ID is required");
  }

  const deletedUser = await prisma.user.delete({
    where: { id: data.id },
  });

  return createSuccessResponse(
    { message: "User deleted successfully" },
    200,
    "users.deleteSuccess"
  );
});

export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const data = await request.json();
  const parsedData = UserSchema.safeParse(data);

  if (!parsedData.success) {
    return handleValidationError(
      parsedData.error,
      "Invalid user data provided"
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: parsedData.data.id },
    data: {
      name: parsedData.data.name,
      email: parsedData.data.email,
      createdAt: parsedData.data.createdAt,
      isActive: parsedData.data.isActive,
    },
  });

  return createSuccessResponse(updatedUser, 200, "users.updateSuccess");
});
