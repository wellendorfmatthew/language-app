import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "../../../../lib/jwt";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email } = body;

    try {
        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        if (userExists) {

        const secret = process.env.JWT_KEY || "";

        const token = sign(
            {
              email,
            },
            secret, {
              expiresIn: 0
            }
          );
  
        const serialized = serialize("session", token, {
            httpOnly: true,
            maxAge: 0,
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
        console.error("Signout error: ", error);
        return NextResponse.json(

            { message: "Unable to sign out" },
            { status: 500 }
        );
    }
}