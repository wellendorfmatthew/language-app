import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    try {
        const email = req.nextUrl.searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { email: email}
        })

        if (!userExists) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        
        const flashcardDecks = await prisma.flashcardDeck.findMany({
                where: { userId: userExists.id },
                include: { flashcards: true },
            })

        return NextResponse.json({ data: flashcardDecks });
        
    } catch (error) {
        console.error("Unable to retrieve flashcard decks: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve flashcard decks"},
            { status: 500 }
        );
    }
}
