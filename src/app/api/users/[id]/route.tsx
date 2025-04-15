import prisma from "@/prisma/client";
import {
  withErrorHandling,
  createSuccessResponse,
  handleNotFoundError,
} from "@/lib/api/errorHandler";
import { NextRequest } from "next/server";

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    // Extract the user ID from the request parameters
    const userId = params?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return handleNotFoundError("User");
    }

    // Return a standardized response with the user data
    return createSuccessResponse(user, 200, "users.fetchSuccess");
  }
);
