import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { error } from "console";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { userID, name } = body;
    try {
        if (!userID) {
            return NextResponse.json(
                { message: "User id is required" },
                { status: 400 }
            );
        }

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { message: "Deck name is required" },
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
        
        const flashcardDeck = await prisma.flashcardDeck.create({
                data: {
                    name: name.trim(),
                    userId: userID,
                    flashcards: {

                    }
                }
            })

        return NextResponse.json({ data: flashcardDeck }, { status: 201 });
        
    } catch (error) {
        console.error("Unable to retrieve flashcard decks: ", error);
        return NextResponse.json(
            { message: "An error occurred while trying to create the flashcard deck"},
            { status: 500 }
        );
    }
}
