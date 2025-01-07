import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "../../../../lib/jwt";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const serialized = serialize("session", "", {
            httpOnly: true,
            maxAge: 0,
            path: '/'
        })

        return NextResponse.json(
            { message: "Successfully signed out ", serialized},
            { status: 200, headers: { "Set-Cookie": serialized } },
        )

    } catch (error) {
        console.error("Signout error: ", error);
        return NextResponse.json(
            { message: "Unable to sign out" },
            { status: 500 }
        );
    }
}