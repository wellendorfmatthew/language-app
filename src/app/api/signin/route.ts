import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "../../../../lib/jwt";
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
            if (userExists.password !== password) {
                return NextResponse.json({error: "Credentials do not match"}, { status: 406});
            }

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
            { message: "Successfully signed in ", userExists},
            { status: 200, headers: { "Set-Cookie": serialized } },
        )
        } else {
            return NextResponse.json({message: "Couldn't find account with that email"}, {status: 404});
        }

    } catch (error) {
        console.error("Signin error: ", error);
        return NextResponse.json(

            { message: "Unable to sign in" },
            { status: 500 }
        );
    }
}