import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
    const cookieStore = await cookies();

    const token = cookieStore.get("session");
    console.log(token, "This is inside of getSession");

    if (!token) {
        return NextResponse.json({error: "Unauthorized access"}, {status: 403});
    }

    const { value } = token;
    const secret = process.env.JWT_KEY || "";

    try {
        const result = verify(value, secret);
        console.log("this is the result ", result);
        return NextResponse.json({token: result}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}
