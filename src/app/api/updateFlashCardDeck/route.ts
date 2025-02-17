import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const PUT = async (req: NextRequest) => {
    const body = await req.json();
    const { userID, flashcardDeckID, name, flashcards } = body;
    try {
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

        if (!name && !flashcards) {
            return NextResponse.json(
                { message: "Deck name and flashcards are required" },
                { status: 400 }
            )
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

        const updatedFlashcardDeck = await prisma.flashcardDeck.update({
            where: { id: flashcardDeckID },
            data: {
                name: name,
                flashcards: {
                    updateMany: flashcards?.map((flashcard: { id: string; question: string; answer: string }) => ({
                        where: { id: flashcard.id },
                        data: {
                            question: flashcard.question,
                            answer: flashcard.answer
                        }
                    })),
                },
            },
            include: { flashcards: true },
            })

        return NextResponse.json({ data: updatedFlashcardDeck }, { status: 200 });
        
    } catch (error) {
        console.error("Unable to retrieve flashcard decks: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to create the flashcard deck"},
            { status: 500 }
        );
    }
}
