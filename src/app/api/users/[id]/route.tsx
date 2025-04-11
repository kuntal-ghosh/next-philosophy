import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest, { params }: { params: { id: number } }) {

  // Extract the user ID from the request parameters
  const userId = params?.id;
  // You can use the userId to fetch user data or perform other operations
  // For demonstration, we'll just return a simple response
  // You can also use request.url to get the full URL of the request
  // const url = request.url;
  // console.log(`Request URL: ${url}`);
  const user = prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });
  if (!user) {
    return NextResponse.json({ message: `User with ID ${userId} not found` }, { status: 404 });
  }
  // Return a JSON response with the user data

  return NextResponse.json({ message: `Hello from the API route! User ID: ${userId}` });
}
