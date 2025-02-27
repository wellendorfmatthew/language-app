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
import { useRouter } from "next/navigation";
import { Flashcard } from "@prisma/client";

type CardStyle = "base" | "active" | "right" | "wrong";

type MatchingCard = {
    id: string,
    field: string
    style: CardStyle,
    class: string,
};

export default function MatchingGame() {
    const [flashcards, setFlashcards] = useState<MatchingCard[]>([]);
    const [possibleMatches, setPossibleMatches] = useState<MatchingCard[]>([]);
    const [isGameOver, setIsGameOver] = useState(true);
    const [time, setTime] = useState("0.0");
    const router = useRouter();

    const handleCardClick = (card: MatchingCard) => {
        const updateFlashcards = (style: CardStyle, firstCard?: MatchingCard) => {
            const newFlashcards = flashcards.map((flashcard) => {
                if (flashcard.field === card.field || flashcard.field === firstCard?.field) { // Change this to something that's guaranteed to be unique
                    return { ...flashcard, style: style };
                }

                return flashcard;
            })

            return newFlashcards;
        }
        
        if (possibleMatches.length === 0) {
            setFlashcards(updateFlashcards("active"));
            setPossibleMatches([card]);
        } else {
            setFlashcards(updateFlashcards("active"));
            if (possibleMatches[0].id === card.id) {
                setFlashcards(updateFlashcards("right", possibleMatches[0]));
                setTimeout(() => {
                    const newFlashcards = flashcards.filter((flashcard) => flashcard.id !== card.id); // Makes sure to get both flashcards that were matched
                    setFlashcards(newFlashcards);
                    console.log(newFlashcards);
                }, 300);

                setPossibleMatches([]);
            } else {
                setFlashcards(updateFlashcards("wrong", possibleMatches[0]));

                setTimeout(() => {
                    setFlashcards(updateFlashcards("base", possibleMatches[0]));
                }, 300);

                setPossibleMatches([]);
            }
        }
    }
    
    const shuffleCards = (cards: Flashcard[]): MatchingCard[] => {
        const shuffle = (array: any[]) => { // Takes flashcards and creates a shuffled deck
            const newArray = [...array];

            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }

            return newArray;
        }

        const shuffledQuestions = shuffle(cards);
        const questions: MatchingCard[] = shuffledQuestions.map((card) => ({ id: card.id, field: card.question, style: "base", class: "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer hover:bg-gray-400 duration-300" }));
        console.log(questions)

        const shuffledAnswers = shuffle(cards);
        const answers: MatchingCard[] = shuffledAnswers.map((card) => ({ id: card.id, field: card.answer, style: "base", class: "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer hover:bg-gray-400 duration-300" }));
        console.log(answers)

        const shuffledDeck: MatchingCard[] = shuffle(questions.concat(answers)); // Shuffle the questions and answers
        console.log(shuffledDeck);

        return shuffledDeck;
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

    const restartGame = async() => {
        setFlashcards([]);
        const deck = await getFlashcards();
        const shuffledDeck = shuffleCards(deck);
        setFlashcards(shuffledDeck);
        setIsGameOver(false);
    }

    const timer = (startTime = Date.now()) => {
        const elapsedTime = Date.now() - startTime;
        const elapsedSeconds = elapsedTime / 1000;

        setTime(`${elapsedSeconds.toFixed(1)}`);

        if (isGameOver) {
            console.log("Timer stopped");
            return;
        }

        setTimeout(() => timer(startTime), 100);
    }

    useEffect(() => {
    (async () => { 
        const flashcardDeck = await getFlashcards();
        console.log("flashcards", flashcardDeck);
        const shuffledDeck = shuffleCards(flashcardDeck);
        console.log(shuffledDeck);

        setFlashcards(shuffledDeck);
        setIsGameOver(false);
    })()
    }, []);

    useEffect(() => {
        if (isGameOver) {
            console.log("Timer stopped");
            return;
        }

        const startTime = Date.now();

        const updateTimer = () => {
            const elapsedTime = Date.now() - startTime;
            setTime((elapsedTime / 1000).toFixed(1));

            if (!isGameOver) {
                timeoutId = setTimeout(updateTimer, 100);
            }
        };

        let timeoutId = setTimeout(updateTimer, 100);

        return () => clearTimeout(timeoutId);
    }, [isGameOver]);

    useEffect(() => {
        if (flashcards.length === 0) {
            setIsGameOver(true);
            console.log("owari da");
        }
    }, [flashcards])

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center">
                <Header />
                <h1 className="font-bold text-3xl mt-12">Your Score</h1>
                <p className="font-bold text-xl mt-4">{time}</p>
                <div className="flex items-center justify-center gap-4 mt-8">
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
        )
    } else {
        return (
            <div className="flex flex-col items-center">
                <Header />
                <h1 className="font-bold text-3xl mt-12">Matching Game</h1>
                <p className="font-bold text-xl mt-4">{time}</p>
                <div className="grid grid-cols-4 gap-4 mt-12">
                    {flashcards.map((flashcard, index) => (
                        <div 
                            className={`w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer
                                ${
                                    flashcard.style === "active"
                                        ? "bg-primary_purple"
                                        : flashcard.style === "right"
                                        ? "bg-primary_green"
                                        : flashcard.style === "wrong"
                                        ? "bg-primary_red"
                                        : "hover:bg-gray-400 duration-300"
                                }`}
                            key={index}
                            onClick={() => handleCardClick(flashcard)}
                        >
                            {flashcard.field}
                        </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}