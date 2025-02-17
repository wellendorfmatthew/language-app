'use client'

import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function WritingTest() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [progress, setProgress] = useState(10);
    const [facingFront, setFacingFront] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [id, setID] = useState(0);
    const [answer, setAnswer] = useState("");

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

    const shuffleCards = (cards: Flashcard[]): Flashcard[] => {
        const newArray = [...cards];
    
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
    
        return newArray;
    }

    const handleAnswer = (answer: string) => {
        if (answer === flashcards[id].answer) {
            setID(id + 1);
            setAnswer("");
            setProgress(progress + 10);
        }
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

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <Header />
             <div className="mt-12 flex flex-col justify-center items-center gap-8">
                <h1 className="font-bold text-3xl">Writing</h1>
                <Progress value={progress} className="h-8 w-80" />
                {flashcards.length > 0 ? (
                    <div className="flex items-center justify-center border-2 rounded-lg border-black w-80 h-52">
                        <p className="font-bold">{flashcards[id].question} translates to ___?</p>
                    </div>
                ) : (
                    <Skeleton className="w-80 h-52 rounded-lg" />
                )}
                <input 
                    type="text" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} className="border-b-4 outline-none border-black text-3xl text-center font-bold" 
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAnswer(answer)
                        }
                    }}
                />
             </div>
        </div>
    )
}