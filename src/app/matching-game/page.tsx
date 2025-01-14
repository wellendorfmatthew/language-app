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

type MatchingCard = {
    id: string,
    field: string
}

export default function MatchingGame() {
    const [flashcards, setFlashcards] = useState<MatchingCard[]>([]);
    const [matchedCards, setMatchedCards] = useState<Flashcard[]>([{ question: '', answer: '' } as Flashcard]);
    const [possibleMatches, setPossibleMatches] = useState({ question: "", answer: "" });
    const [sum, setSum] = useState(0);

    const handleSum = (field: string, id: number) => {
        let num = sum + 1;
        setSum(num);
        console.log(num);

        if (num === 1) {
            possibleMatches.question = field;
            console.log(possibleMatches);
        }

        if (num === 2) {
            possibleMatches.answer = field;
            console.log(possibleMatches);
            //handleMatch();
        }
    }

    // const handleMatch = () => {
    //     const match = flashcards.find((flashcard) => {
    //         console.log(flashcard);
    //         console.log(flashcard.question);
    //         console.log(flashcard.answer);
    //         console.log(possibleMatches.question);
    //         console.log(possibleMatches.answer);
    //         if (flashcard.question === possibleMatches.question && flashcard.answer === possibleMatches.answer
    //             || flashcard.answer === possibleMatches.question && flashcard.question === possibleMatches.answer) {
    //                 return flashcard;
    //             }
    //     })

    //     if (match) {
    //         const updatedFlashcards = [...matchedCards, 

    //             {   
    //                 id: match.id, 
    //                 question: match.question, 
    //                 answer: match.answer,
    //                 createdAt: match.createdAt,
    //                 flashcardDeckID: match.flashcardDeckID

    //             }
    //         ];
    //         setMatchedCards(updatedFlashcards);

    //         const currentFlashcards = [...flashcards];
    //         const newFlashcards = currentFlashcards.filter((flashcard) => flashcard !== match);
    //         setFlashcards(newFlashcards);
    //         console.log("Match");
    //         setSum(0);
    //     } else {
    //         console.log("No Match");
    //         setSum(0);
    //     }
    // }
    
    const shuffleCards = (cards: Flashcard[]) => {
        const shuffle = (array: any[]) => {
            const newArray = [...array];

            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }

            return newArray;
        }

        const shuffledQuestions = shuffle(cards);
        const questions: MatchingCard[] = shuffledQuestions.map((card) => ({ id: card.id, field: card.question }));
        console.log(questions)

        const shuffledAnswers = shuffle(cards);
        const answers: MatchingCard[] = shuffledAnswers.map((card) => ({ id: card.id, field: card.answer }));
        console.log(answers)

        const shuffledDeck: MatchingCard[] = shuffle(questions.concat(answers));
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

        if (!flashcards) {
            console.log("can't get cards");
        }

        setFlashcards(shuffledDeck);

        //setMatchedCards(flashcardDeck.map(() => ({ question: '', answer: ' ' } as Flashcard)));
    })()
    }, []);

    return (
        <div className="flex flex-col items-center">
            <Header />
            <div className="grid grid-cols-4 gap-4 mt-12">
                {flashcards.map((flashcard, index) => (
                    <div 
                        className="w-60 h-60 rounded-lg border-primary_blue border-4 flex justify-center items-center cursor-pointer hover:bg-gray-400 duration-300" 
                        key={index}
                        onClick={() => handleSum(flashcard.field, index)}
                    >
                        {flashcard.field}
                    </div>
                    ))
                }
            </div>
        </div>
    )
}