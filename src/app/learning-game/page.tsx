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
    const [learnedCards, setLearnedCards] = useState<Flashcard[]>([]);
    const [facingFront, setFacingFront] = useState(true);
    
    const handleClick = () => {
        setFacingFront(!facingFront)
    }

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

    const handleLearnedCards = (flashcard: Flashcard) => {
        const newLearnedCards = [...learnedCards];
        newLearnedCards.push(flashcard);
        setLearnedCards(newLearnedCards);

        const currentFlashcards = [...flashcards];
        const newFlashcards = currentFlashcards.filter((currentCard) => currentCard !== flashcard);
        setFlashcards(newFlashcards);
    }

    useEffect(() => {
    (async () => { 
        const flashcardDeck = await getFlashcards();
        console.log("flashcards", flashcardDeck);

        if (!flashcardDeck || flashcardDeck.length === 0) {
            console.log("Can't get cards");
        }

        setFlashcards(flashcardDeck)
    })()
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <Header />
            <Carousel className="relative overflow-hidden w-full max-w-4xl">
                <CarouselContent className="flex justify-center">
                    {flashcards.map((flashcard) => (
                        <CarouselItem className="px-4" key={flashcard.id}>
                            <div className="flip-card mt-20 cursor-pointer" onClick={handleClick}>
                                <div className={`flip-card-inner ${!facingFront ? "flipped" : ""}`}>
                                    <div className="flip-card-front bg-primary_blue rounded-xl">
                                        <p>{flashcard.question}</p>
                                    </div>
                                    <div className="flip-card-back bg-primary_blue rounded-xl">
                                        <p>{flashcard.answer}</p>
                                        <div className="flex gap-4">
                                            <p onClick={() => handleLearnedCards(flashcard)}>I knew that</p>
                                            <p>I need more time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" onClick={() => setFacingFront(true)} />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" onClick={() => setFacingFront(true)} />
            </Carousel>
        </div>
    )
}