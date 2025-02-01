import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import FlashcardDeck from "@/app/components/flashcard-deck";

export default function Flashcards({ params, }: { params: { flashcardDeckID: string } } ) {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <FlashcardDeck flashcardDeckID={params.flashcardDeckID} />
        </div>
    )
}