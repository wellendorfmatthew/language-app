import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) { 
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

        const secret = process.env.JWT_KEY || "";

        const token = sign(
            {
              email,
            },
            secret, {
              expiresIn: 60 * 60 * 24 * 30
            }
          );
  
        const serialized = serialize("session", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
        })

        return NextResponse.json(
            { message: "User created successfully ", createUser},
            { status: 201, headers: { "Set-Cookie": serialized } },
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