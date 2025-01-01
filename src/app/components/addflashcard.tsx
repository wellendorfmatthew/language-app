'use client'

import { Flashcard } from "@prisma/client";
import React, { useEffect, useState } from "react";

export default function AddFlashCardForm() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [flashcards, setFlashcards] = useState<Flashcard[]>([
        { question: '', answer: '' } as Flashcard,
    ]);

    const handleInputChange = (index: number, field: 'question' | 'answer', value: string) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index][field] = value;
        setFlashcards(updatedFlashcards);
    }

    const addFlashcardInput = () => {
        setFlashcards([...flashcards, { question: '', answer: '' } as Flashcard]);
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("api/addFlashCards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flashcardDeckID: "765a621a-b0bb-417d-b8fe-03025eef6d5d", // Need to revise this so that i'm able to obtain the flashcardDeckID
                    flashcards: flashcards
                }),
            })
    
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json);   
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleAddingCard = async(question: string, answer: string) => {
        try {
            const response = await fetch("api/addFlashCard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flashcardDeckID: "765a621a-b0bb-417d-b8fe-03025eef6d5d", // Need to revise this so that i'm able to obtain the flashcardDeckID
                    question: question,
                    answer: answer
                }),
            })
    
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json);   
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
           {flashcards.map((flashcard, index) => (
            <div key={index}>
                <div>
                    <label htmlFor={`question-${index}`}>Question</label>
                    <input 
                        type="text"
                        id={`question-${index}`}
                        value={flashcard.question}
                        onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor={`answer-${index}`}>Answer</label>
                    <input 
                        type="text"
                        id={`answer-${index}`}
                        value={flashcard.answer}
                        onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                    />
                </div>
            </div>
           ))}
            <button type="button" onClick={addFlashcardInput}>Add Another Flashcard</button>
            <button type="submit">Add All Flashcards</button>
        </form>
    )
}