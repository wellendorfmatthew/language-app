'use client'

import React, { useEffect, useState } from "react";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";
import Check from "../../../public/langapp-checkbutton.png";
import Cross from "../../../public/langapp-deletebutton.png";
import Image from "next/image";

export default function LearningGame() {
    const [api, setApi] = useState<CarouselApi>();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [facingFront, setFacingFront] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [id, setID] = useState("");

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

    const handleKnowCard = (flashcard: Flashcard) => {
        const newDeck = flashcards.filter((card) => flashcard.id !== card.id);
        console.log(newDeck);
        setFlashcards(newDeck);
    }

    const handleDontKnowCard = (flashcard: Flashcard) => {
        const updatedDeck = flashcards.filter((card) => flashcard.id !== card.id);
        updatedDeck.push(flashcard);
        console.log(updatedDeck);

        setFlashcards(updatedDeck);
    }

    const handleSlideChange = (index: number) => {
        setCurrentIndex(index);
        const currentFlashcard = flashcards[index];
        if (currentFlashcard) {
            setID(currentFlashcard.id);
        }
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

    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            const index = api.selectedScrollSnap();
            handleSlideChange(index);
        })
    }, [api]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <Header />
            <Carousel className="max-w-4xl justify-center items-center mt-20" setApi={setApi}>
                <CarouselContent>
                    {flashcards.map((flashcard) => (
                        <CarouselItem key={flashcard.id}>
                            <div className="flip-card cursor-pointer ml-[256px]" onClick={() => setFacingFront(!facingFront)}>
                                <div className={`flip-card-inner ${!facingFront ? "flipped" : ""}`}>
                                    <div className="flip-card-front bg-primary_blue rounded-xl">
                                        <p>{flashcard.question}</p>
                                    </div>
                                    <div className="flip-card-back bg-primary_blue rounded-xl">
                                        <p>{flashcard.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
             <div className="mt-12 flex justify-center gap-12 w-[400px] ml-4">
                <div className="flex justify-center items-center gap-8 flex-col">
                    <button onClick={() => handleDontKnowCard(flashcards[currentIndex])}><Image src={Cross} alt="Cross"></Image></button>
                    <p className="text-[#ff4444]">Still learning</p>
                </div>
                <div className="flex justify-center items-center gap-8 flex-col">
                    <button onClick={() => handleKnowCard(flashcards[currentIndex])}><Image src={Check} alt="Check"></Image></button>
                    <p className="text-[#14c014]">I know it now</p>
                </div>
             </div>
        </div>
    )
}