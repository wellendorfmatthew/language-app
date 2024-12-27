import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "../../../../lib/jwt";

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

            const dataToEncrypt = {email: email, password: password};
            console.log(dataToEncrypt);
            const expires  = 60 * 60 * 24 * 7; // When the session will expire
            const session = await encrypt({dataToEncrypt, expires})
    
            ;(await cookies()).set('session', session, {expires, httpOnly: true, path: "/"})
            console.log(session);
            return NextResponse.json(
                { message: "Successfully signed in" },
                { status: 200 }
            );
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