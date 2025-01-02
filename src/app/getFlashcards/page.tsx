'use client'

import React, { useEffect, useState } from "react";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";

export default function GetFlashCards() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const getFlashcards = async() => {
        try {
            const response = await fetch(`api/getFlashCards?id=${"765a621a-b0bb-417d-b8fe-03025eef6d5d"}`);
    
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
        <div className="flex flex-col items-center">
            <Header />
            <Carousel>
                <CarouselContent className="-ml-4">
                    {flashcards.map((flashcard, index) => (
                        <CarouselItem className="pl-4" key={index}>
                            <p>Question: {flashcard.question}</p>
                            <p>Answer: {flashcard.answer}</p>
                        </CarouselItem>
                    ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}