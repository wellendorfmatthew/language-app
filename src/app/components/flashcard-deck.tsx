'use client'

import React, { useEffect, useState } from "react";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Flashcard } from "@prisma/client";

export default function FlashcardDeck({flashcardDeckID}: {flashcardDeckID: string}) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const getFlashcards = async() => {
        try {
            const response = await fetch(`/api/getFlashCards?id=${flashcardDeckID}`);
    
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json.data);

            return json.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
    (async () => { 
        const flashcardDeck = await getFlashcards();
        console.log("flashcards", flashcardDeck);

        if (!flashcards) {
            console.log("can't get cards");
        }

        setFlashcards(
            flashcardDeck.map((flashcard: Flashcard) => ({
                question: flashcard.question,
                answer: flashcard.answer
            }))
        )
    })()
    }, []);

    return (
        <div className="grid grid-cols-1 gap-8 w-1/3 mt-8">
            {flashcards.map((flashcard, index) => (
                <div className="border-primary_blue border-2 rounded-lg flex flex-col">
                    <div className="flex justify-between items-center">
                        <p>{index}</p>
                        <p>Delete</p>
                    </div>
                    <hr className="border-primary_blue h-1 w-full" />
                    <div className="flex justify-center items-center gap-8">
                        <input type="text" placeholder={flashcard.question} />
                        <input type="text" placeholder={flashcard.answer} />
                    </div>
                    <button>Edit</button>
                </div>
            ))
            }
        </div>
    )
}