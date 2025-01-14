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

    const handleCardClick = (card: MatchingCard) => {
        const updatedFlashcards: MatchingCard[] = flashcards.map((flashcard) => {
            if (flashcard.id === card.id) {
                return { ...flashcard, style: "active" };
            }

            return flashcard;
        })

        setFlashcards(updatedFlashcards);
        
        if (possibleMatches.length === 0) {
            setPossibleMatches([card]);
            console.log("purple");
        } else {
            console.log("purple");
            if (possibleMatches[0].id === card.id) {
                console.log("green");
                console.log("green");

                possibleMatches[0].class = "right";
                card.class = "right";

                setTimeout(() => {
                    getStyle(possibleMatches[0]);
                    getStyle(card);
                }, 2000);

                const newFlashcards = flashcards.filter((flashcard) => flashcard.id !== card.id);
                setFlashcards(newFlashcards);
                setPossibleMatches([]);
            } else {
                console.log("red");
                console.log("red");

                possibleMatches[0].class = "wrong";
                card.class = "wrong";
                setTimeout(() => {
                    getStyle(possibleMatches[0]);
                    getStyle(card);
                }, 2000);

                console.log("gray");
                console.log("gray");

                possibleMatches[0].class = "base";
                card.class = "base";
                getStyle(possibleMatches[0]);
                getStyle(card);

                setPossibleMatches([]);
            }
        }
    }

    const getStyle = (card: MatchingCard) => {
        switch (card.style) {
            case "active":
                card.class = "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer bg-primary_purple";
                break;
            case "right":
                card.class = "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer bg-primary_green";
                break;
            case "wrong":
                card.class = "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer bg-primary_red";
                break;
            default:
                card.class = "w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer hover:bg-gray-400 duration-300";
                break;
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

    useEffect(() => {
    (async () => { 
        const flashcardDeck = await getFlashcards();
        console.log("flashcards", flashcardDeck);
        const shuffledDeck = shuffleCards(flashcardDeck);
        console.log(shuffledDeck);

        setFlashcards(shuffledDeck);
    })()
    }, []);

    return (
        <div className="flex flex-col items-center">
            <Header />
            <div className="grid grid-cols-4 gap-4 mt-12">
                {flashcards.map((flashcard, index) => (
                    <div 
                        className={flashcard.class}
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