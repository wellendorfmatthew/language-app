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
import Check from "../../../public/check_icon.png";
import Cross from "../../../public/close_icon.png";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LearningGame() {
    const [api, setApi] = useState<CarouselApi>();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [unknownCards, setUnknownCards] = useState<Flashcard[]>([]);
    const [progress, setProgress] = useState(10);
    const [facingFront, setFacingFront] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [id, setID] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const router = useRouter();

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

    const handleKnowCard = () => {
        const newId = id + 1;
        setID(newId);
        setProgress(progress + 10);

        if (id + 1 === flashcards.length) {
            setIsGameOver(true);
        }
    }

    const handleDontKnowCard = (flashcard: Flashcard) => {
        const newId = id + 1;
        setID(newId);
        const newUnknownCards = unknownCards;
        newUnknownCards.push(flashcard);
        console.log(newUnknownCards);
        setUnknownCards(newUnknownCards);
        
        if (id + 1 === flashcards.length) {
            setIsGameOver(true);
        }
    }

    const shuffleCards = (cards: Flashcard[]): Flashcard[] => {
        const newArray = [...cards];
        
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        
        return newArray;
    }

    const restartGame = () => {
        setIsGameOver(false);
        setID(0);
        setProgress(0);
        setUnknownCards([]);
        const newShuffledCards = shuffleCards(flashcards);
        setFlashcards(newShuffledCards);
    }

    useEffect(() => {
    (async () => { 
        const flashcardDeck = await getFlashcards();
        console.log("flashcards", flashcardDeck);

        if (!flashcardDeck || flashcardDeck.length === 0) {
            console.log("Can't get cards");
        }

        const shuffledDeck = shuffleCards(flashcardDeck);

        console.log(shuffledDeck);
        console.log(shuffledDeck[0]);
        console.log(shuffledDeck[0].question);

        setFlashcards(shuffledDeck)
    })()
    }, []);

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <Header />
                <div className="mt-12 flex flex-col justify-center items-center gap-8">
                    <h1 className="font-bold text-3xl">Cards to Study</h1>
                    <div className="grid grid-cols-3 gap-8">
                        {
                            unknownCards.map((card, index) => (
                                <div className="flex flex-col gap-4 items-center justify-center border-2 rounded-lg border-black w-80 h-52" key={index}>
                                    <div className="flex flex-col gap-2 items-center justify-center">
                                        <p className="font-bold">Question</p>
                                        <p>{card.question}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center justify-center">
                                        <p className="font-bold">Answer</p>
                                        <p>{card.answer}</p>
                                    </div>
                                </div>
                            ))
                        }      
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button 
                            className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2 w-32 h-12" 
                            onClick={() => restartGame()}
                        >
                        Play Again
                        </button>
                        <button 
                            className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2 w-32 h-12" 
                            onClick={() => router.push("/")}
                        >
                        Home
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <Header />
                 <div className="mt-12 flex flex-col justify-center items-center gap-8">
                    <h1 className="font-bold text-3xl">Learning Game</h1>
                    <Progress value={progress} className="h-8 w-80" />
                    {flashcards.length > 0 ? (
                        <div className="flip-card cursor-pointer" onClick={() => setFacingFront(!facingFront)}>
                            <div className={`flip-card-inner ${!facingFront ? "flipped" : ""}`}>
                                <div className="flip-card-front border-2 rounded-lg border-black">
                                    <p className="font-bold">{flashcards[id].question}</p>
                                </div>
                                <div className="flip-card-back border-2 rounded-lg border-black">
                                    <p className="font-bold">{flashcards[id].answer}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="w-80 h-52 rounded-lg" />
                    )}
                    <div className="flex items-center justify-center gap-4">
                        <button className="bg-primary_red rounded-3xl text-white py-3 px-3 w-24 flex items-center justify-center" ><Image src={Cross} alt="X" className="w-[32px] h-[32px]" onClick={() => handleDontKnowCard(flashcards[id])} /></button>
                        <p className="text-xl font-bold w-[51px] text-center">{id + 1}/{flashcards.length}</p>
                        <button className="bg-primary_green rounded-3xl text-white py-3 px-3 w-24 flex items-center justify-center" ><Image src={Check} alt="Check" className="w-[32px] h-[32px]" onClick={() => handleKnowCard()} /></button>
                    </div>
                 </div>
            </div>
        )
    }
}