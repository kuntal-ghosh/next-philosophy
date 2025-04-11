import { NextRequest } from "next/server";
import { UserSchema } from "./schema";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
   const users = await prisma.user.findMany();
   return new Response(JSON.stringify(users), {
       status: 200,
       headers: {
           "Content-Type": "application/json",
       },
   });

}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const parsedData = UserSchema.safeParse(data);
        
        if (!parsedData.success) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    code: "validation_failed",
                    message: "Invalid user data provided",
                    errors: parsedData.error.format()
                }), 
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        try {
            // find user by email to check it exists
            const existingUser = await prisma.user.findUnique({
                where: { email: parsedData.data.email },
            });
            
            if (existingUser) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        code: "user_exists",
                        message: `User with email ${parsedData.data.email} already exists`
                    }),
                    {
                        status: 409, // Conflict is more appropriate than 400
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            
            // Perform any necessary operations with the parsed data
            const user = await prisma.user.create({
                data: {
                    name: parsedData.data.name,
                    email: parsedData.data.email,
                    followers: parsedData.data.followers,
                    following: parsedData.data.following,
                    createdAt: parsedData.data.createdAt || new Date(),
                    isActive: parsedData.data.isActive,
                }
            });

            return new Response(
                JSON.stringify({
                    status: "success",
                    data: user
                }),
                {
                    status: 201,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (dbError) {
            console.error("Database operation failed:", dbError);
            return new Response(
                JSON.stringify({
                    status: "error",
                    code: "database_error",
                    message: "Failed to create user in database",
                    details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } catch (error) {
        console.error("Unexpected error in POST /api/users:", error);
        return new Response(
            JSON.stringify({
                status: "error",
                code: "internal_server_error",
                message: "An unexpected error occurred while processing your request"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function PUT(request: NextRequest) {
    const data = await request.json();
    // Validate the incoming data against the UserSchema
    // This will throw an error if the data does not match the schema
    // You can also use the `safeParse` method to handle validation errors gracefully
    const parsedData = UserSchema.safeParse(data);
    if (!parsedData.success) {
        return new Response(JSON.stringify(parsedData.error), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    // Perform any necessary operations with the parsed data
    // For example, you might want to save it to a database or perform validation
    const { id, name, email, createdAt, updatedAt, isActive } = parsedData.data;
    // Here, you can perform any necessary operations with the validated data
   const user = await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            createdAt,
            isActive
        }
    });
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return new Response(JSON.stringify({ id, name, email, createdAt, updatedAt, isActive }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export async function DELETE(request: NextRequest) {
    const data = await request.json();
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export async function PATCH(request: NextRequest) {
    const data = await request.json();
    // Validate the incoming data against the UserSchema
    // This will throw an error if the data does not match the schema
    // You can also use the `safeParse` method to handle validation errors gracefully
    const parsedData = UserSchema.safeParse(data);
    if (!parsedData.success) {
        return new Response(JSON.stringify(parsedData.error), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    // Perform any necessary operations with the parsed data
    const updatedUser = await prisma.user.update({  
        where: { id: parsedData.data.id },
        data: {
            name: parsedData.data.name,
            email: parsedData.data.email,
            createdAt: parsedData.data.createdAt,
            isActive: parsedData.data.isActive
        }
    });
    if (!updatedUser) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
