'use client'

import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function MultipleChoice() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [answerDeck, setAnswerDeck] = useState<number[]>([]);
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

    const handleAnswer = (answer: string) => {
        if (answer === flashcards[id].answer) {
            const newId = id + 1;
            setID(newId);
            const newAnswerDeck = shuffleAnswers(flashcards, newId);
            setAnswerDeck(newAnswerDeck);
            setProgress(progress + 10);
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

    const shuffleAnswers = (cards: Flashcard[], id: number) => {
        const newArray = [...cards];
        const answersArray: number[] = [id];

        console.log(newArray);
        console.log(id);

        while (answersArray.length < 4) {
            const randomIndex = Math.floor(Math.random() * newArray.length);
            
            if (!answersArray.includes(randomIndex)) {
                answersArray.push(randomIndex);
            }
        }

        console.log(answersArray);
        
        for (let i = answersArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answersArray[i], answersArray[j]] = [answersArray[j], answersArray[i]];
        }

        console.log(answersArray);

        return answersArray;
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

        const shuffledAnswers = shuffleAnswers(shuffledDeck, id);

        console.log(shuffledAnswers);

        setAnswerDeck(shuffledAnswers);
    })()
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <Header />
             <div className="mt-12 flex flex-col justify-center items-center gap-8">
                <h1 className="font-bold text-3xl">Multiple Choice</h1>
                <Progress value={progress} className="h-8 w-80" />
                {flashcards.length > 0 ? (
                    <div className="flex items-center justify-center border-2 rounded-lg border-black w-80 h-52">
                        <p className="font-bold">{flashcards[id].question} translates to ___?</p>
                    </div>
                ) : (
                    <Skeleton className="w-80 h-52 rounded-lg" />
                )}
                {
                    answerDeck.length > 0 ? (
                        <div className="grid grid-cols-2 w-80 gap-8">
                            <button className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2" onClick={() => handleAnswer(flashcards[answerDeck[0]].answer)}>
                                {flashcards[answerDeck[0]].answer}
                            </button>
                            <button className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2" onClick={() => handleAnswer(flashcards[answerDeck[1]].answer)}>
                                {flashcards[answerDeck[1]].answer}
                            </button>
                            <button className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2" onClick={() => handleAnswer(flashcards[answerDeck[2]].answer)}>
                                {flashcards[answerDeck[2]].answer}
                            </button>
                            <button className="border-black rounded-lg flex items-center justify-center text-base font-bol border-2 p-2" onClick={() => handleAnswer(flashcards[answerDeck[3]].answer)}>
                                {flashcards[answerDeck[3]].answer}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 w-80 gap-8">
                            <Skeleton className="w-[144px] h-[44px] rounded-lg" />
                            <Skeleton className="w-[144px] h-[44px] rounded-lg" />
                            <Skeleton className="w-[144px] h-[44px] rounded-lg" />
                            <Skeleton className="w-[144px] h-[44px] rounded-lg" />
                        </div>
                    )
                }
             </div>
        </div>
    )
}