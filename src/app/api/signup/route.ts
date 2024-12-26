import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) { // Also make sure to add password/email validation and hashing
    const body = await req.json();
    const { email, password } = body;

    try {
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        if (userExists) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const createUser = await prisma.user.create({
            data: {
                email: email,
                password: password
            },
        })

        return NextResponse.json(
            { message: "User created successfully", user: createUser },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { message: "Email already taken" },
                    { status: 409 }
                );
            }
        }

        console.error("Signup error: ", error);
        return NextResponse.json(

            { message: "Unable to sign up" },
            { status: 500 }
        );
    }
}