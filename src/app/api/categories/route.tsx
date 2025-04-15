import { createSuccessResponse, withErrorHandling } from "@/lib/api/errorHandler";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async (request: Request) => {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
})
export const POST = withErrorHandling(async (request: Request) => { 
    const data = await request.json();
    const { name } = data;

    const category = await prisma.category.create({
        data: {
            name,
        }
    })

    return createSuccessResponse(category, 201);
}
)
export const PUT = withErrorHandling(async (request: Request) => {
    const data = await request.json();
    const { id, name } = data;

    const category = await prisma.category.update({
        where: { id },
        data: {
            name,
        }
    })

    return createSuccessResponse(category);
}
)
export const DELETE = withErrorHandling(async (request: Request) => {
    const data = await request.json();
    const { id } = data;

    const category = await prisma.category.delete({
        where: { id }
    })

    return createSuccessResponse(category);
}
)