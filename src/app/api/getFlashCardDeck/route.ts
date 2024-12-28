import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    try {
        const userID = req.nextUrl.searchParams.get("userID");
        const flashcardDeckID = req.nextUrl.searchParams.get("flashcardDeckID");

        if (!userID) {
            return NextResponse.json(
                { message: "User id is required" },
                { status: 400 }
            );
        }
        
        if (!flashcardDeckID) {
            return NextResponse.json(
                { message: "Flashcard deck id is required" },
                { status: 400 }
            );
        }
        
        const userExists = await prisma.user.findUnique({
            where: { id: userID}
        })

        if (!userExists) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        
        const flashcardDeck = await prisma.flashcardDeck.findUnique({
                where: { id: flashcardDeckID }
            })

        return NextResponse.json({ data: flashcardDeck });
        
    } catch (error) {
        console.error("Unable to retrieve flashcard decks: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve the flashcard deck"},
            { status: 500 }
        );
    }
}
