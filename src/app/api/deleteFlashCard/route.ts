import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const DELETE = async (req: NextRequest) => {
    const body = await req.json();
    const { flashcardDeckID, flashcardID } = body;
    try {
        if (!flashcardDeckID) {
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
            where: { id: flashcardDeckID }
        })

        if (!flashcardDeck) {
            return NextResponse.json(
                { message: "FlashcardDeck not found" },
                { status: 404 }
            );
        }
        
        const deletedFlashcard = await prisma.flashcard.delete({
                where: { id: flashcardID }
            })

        return NextResponse.json({ data: deletedFlashcard });
        
    } catch (error) {
        console.error("Unable to retrieve flashcards: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve flashcards"},
            { status: 500 }
        );
    }
}
