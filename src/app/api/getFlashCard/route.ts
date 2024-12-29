import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    try {
        const flashcardDeckId = req.nextUrl.searchParams.get("flashcardDeckID");
        const flashcardID = req.nextUrl.searchParams.get("flashcardID");

        if (!flashcardDeckId) {
            return NextResponse.json(
                { message: "FlashcardDeck id is required" },
                { status: 400 }
            );
        }

        if (!flashcardID) {
            return NextResponse.json(
                { message: "Flashcard id is required" },
                { status: 400 }
            );
        }

        const flashcardDeck = await prisma.flashcardDeck.findUnique({
            where: { id: flashcardDeckId }
        })

        if (!flashcardDeck) {
            return NextResponse.json(
                { message: "FlashcardDeck not found" },
                { status: 404 }
            );
        }
        
        const flashcard = await prisma.flashcard.findUnique({
                where: { id: flashcardID }
            })

        return NextResponse.json({ data: flashcard });
        
    } catch (error) {
        console.error("Unable to retrieve flashcards: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve flashcards"},
            { status: 500 }
        );
    }
}
