import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { error } from "console";

export const DELETE = async (req: NextRequest) => {
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

        const deleteUser = await prisma.user.delete({
            where: { email: email}
        });

        const serialized = serialize("session", "", {
            httpOnly: true,
            maxAge: 0,
            path: '/'
        })

        return NextResponse.json(
            { message: "Successfully signed out ", deleteUser},
            { status: 200, headers: { "Set-Cookie": serialized } },
        )

        } else {
            return NextResponse.json({message: "Couldn't find account with that email"}, {status: 404});
        }

    } catch (error) {
        console.error("Signin error: ", error);
        return NextResponse.json(

            { message: "Unable to delete account" },
            { status: 500 }
        );
    }
}
