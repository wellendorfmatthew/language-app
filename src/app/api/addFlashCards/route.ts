import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";
import { Flashcard } from "@prisma/client";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { flashcardDeckID, flashcards } = body;
    try {
        if (!flashcardDeckID) {
            return NextResponse.json(
                { message: "FlashcardDeck id is required" },
                { status: 400 }
            );
        }

        for (let i = 0; i < flashcards.length; i++) {
            if (!flashcards[i].question && !flashcards[i].answer) {
                return NextResponse.json(
                    { messsage: "A question and answer are required for each flashcard"},
                    { status: 400 }
                );
            }
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
        
        const newFlashcards = await prisma.flashcard.createMany({
            data: flashcards.map((flashcard: Flashcard) => ({
                question: flashcard.question,
                answer: flashcard.answer,
                flashcardDeckID: flashcardDeckID
            }))
        })

        return NextResponse.json({ data: newFlashcards });
        
    } catch (error) {
        console.error("Unable to retrieve flashcards: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to retrieve flashcards"},
            { status: 500 }
        );
    }
}
