import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { flashcardDeckID, flashcardID, question, answer } = body;
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

        if (!question && !answer) {
            return NextResponse.json(
                { messsage: "A question and answer are required"},
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
        
        const newFlashcard = await prisma.flashcard.create({
            data: {
                question: question,
                answer: answer,
                flashcardDeckID: flashcardDeckID
            }
        })

        return NextResponse.json({ data: newFlashcard });
        
    } catch (error) {
        console.error("Unable to retrieve flashcards: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve flashcards"},
            { status: 500 }
        );
    }
}
