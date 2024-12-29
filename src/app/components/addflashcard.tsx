'use client'

import React, { useState } from "react";

export default function AddFlashCardForm() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

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
        <form onSubmit={() => handleAddingCard(question, answer)}>
            <div>
                <label htmlFor="question">Question</label>
                <input type="text" id="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div>
                <label htmlFor="answer">Answer</label>
                <input type="text" id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
            <button type="submit">Add Card</button>
        </form>
    )
}