'use client'

import Image from "next/image";
import Header from "@/app/components/header";
import Flashcard from "@/app/components/flashcards";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { FlashcardDeck } from "@prisma/client";
import FlashcardIcon from "../../../../public/blue-card.png";

export default function DeckChoice({ params, }: { params: { gameMode: string } }) {
  const router = useRouter();
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);

  useEffect(() => {
    (async () => { 
      const user = await getUser();
      console.log("user", user);

      if (!user) {
        router.push("/signin")
        return;
      }
      const flashcardDecks = await getFlashcardDecks(user);
      console.log(flashcardDecks);

      if (!flashcardDecks) {
        console.log("unable to get flashcard decks");
      }

      setFlashcardDecks(flashcardDecks);
    })()
  }, [])

  const getUser = async() => {
    try {
      const response = await fetch("/api/getSession");
      const data = await response.json();
      console.log("This is the token: ", data.token);
      console.log("This is the email: ", data.token.email); 
      return data.token.email
    } catch (error) {
      return null;
    }
  }

  const getFlashcardDecks = async(email : any) => {
    try {
      const response = await fetch(`/api/getFlashCardDecks?email=${email}`);
      console.log(response);
      const json = await response.json();
      console.log(json.data);

      return json.data;
    } catch (error) {
      return null;
    }
  }

  const handleFlashcardDeckClick = (flashcardDeckID : string) => {
    router.push(`/${params.gameMode}/deckChoice/${flashcardDeckID}`);
  }
  
  return (
      <div className="flex flex-col items-center justify-center gap-8">
        <Header />
        <div className="flex flex-col gap-8 justify-center items-center">
          <h1 className="font-bold text-3xl">Choose a deck</h1>
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-12">
              {
                flashcardDecks?.map((deck, index) => (
                  <div 
                  className="border-primary_blue border-2 py-4 flex justify-start items-center w-60 cursor-pointer rounded-md gap-8 hover:shadow-xl" 
                  key={index}
                  onClick={() => handleFlashcardDeckClick(deck.id)} 
                  >
                    <Image src={FlashcardIcon} alt="card" />
                    <div className="flex flex-col gap-4 justify-center items-start">
                      <p 
                        className="font-semibold text-base truncate"
                      >
                      {deck.name} 
                      </p>
                      <p className="font-semibold text-base">{flashcardDecks.length} Terms</p>
                    </div>
                  </div>
              ))}
            </div>
        </div>
      </div>
    );
}
