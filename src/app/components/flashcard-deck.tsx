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
import Trashcan from "../../../public/trash-can-small.png";
import Image from "next/image";

export default function FlashcardDeck({flashcardDeckID}: {flashcardDeckID: string}) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const deleteFlashcard = async(flashcardID: string) => {
        console.log(flashcardID);
        try {
            const response = await fetch("/api/deleteFlashCard", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    flashcardDeckID: flashcardDeckID,
                    flashcardID: flashcardID
                })
            });
    
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json.data);

            const newFlashcards = flashcards.filter((card) => card.id !== flashcardID);
            console.log(newFlashcards);

            setFlashcards(newFlashcards);

            return json.data;
        } catch (error: any) {
            console.log(error);
        }
    }

    const editFlashcard = async(flashcardID: string, question: string, answer: string) => {
        console.log(flashcardID);
        console.log(question);
        console.log(answer);
        try {
            const response = await fetch("/api/updateFlashCard", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    flashcardDeckID: flashcardDeckID,
                    flashcardID: flashcardID,
                    question: question,
                    answer: answer
                })
            });
    
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json.data);

            setFlashcards((prev) => 
                prev.map((card) => 
                    card.id === flashcardID ? { ...card, question: question, answer: answer } : card
                )
            )

            return json.data;
        } catch (error: any) {
            console.log(error);
        }
    }

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

    const handleInputChange = (id: string, field: "question" | "answer", value: string) => {
        setFlashcards((prev) => 
            prev.map((card) => 
                card.id === id ? { ...card, [field]: value } : card
            )
        );
    };

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
                answer: flashcard.answer,
                id: flashcard.id
            }))
        )
    })()
    }, []);

    return (
        <div className="grid grid-cols-1 gap-8 w-1/3 mt-8">
            {flashcards.map((flashcard, index) => (
                <div className="border-primary_blue border-2 rounded-lg flex flex-col" key={index}>
                    <div className="flex justify-between items-center px-4 py-2">
                        <p>{index}</p>
                        <Image src={Trashcan} alt="trash" className="cursor-pointer" onClick={() => deleteFlashcard(flashcard.id)} />
                    </div>
                    <hr className="border-primary_blue h-1 w-full" />
                    <div className="flex justify-center items-center flex-col gap-8 px-4 py-4">
                        <div className="flex justify-center items-center gap-8">
                            <div className="flex flex-col gap-4 items-center justify-center">
                                <label htmlFor="front" className="font-bold">Question</label>
                                <input type="text" id="front" value={flashcard.question} onChange={(e) => handleInputChange(flashcard.id, "question", e.target.value)} className="text-center border-b-2 border-primary_blue outline-none pb-2" />
                            </div>
                            <div className="flex flex-col gap-4 items-center justify-center">
                                <label htmlFor="back" className="font-bold">Answer</label>
                                <input type="text" id="back" value={flashcard.answer} onChange={(e) => handleInputChange(flashcard.id, "answer", e.target.value)} className="text-center border-b-2 border-primary_blue outline-none pb-2" />
                            </div>
                        </div>
                        <button className="bg-primary_blue px-8 py-4 rounded-lg" onClick={() => editFlashcard(flashcard.id, flashcard.question, flashcard.answer)}>Save</button>
                    </div>
                </div>
            ))
            }
        </div>
    )
}