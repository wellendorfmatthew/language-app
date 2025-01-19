'use client'

import Image from "next/image";
import Header from "./components/header";
import Flashcard from "./components/flashcards";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import AddFlashCardForm from "./components/addflashcard";
import { FlashcardDeck } from "@prisma/client";

export default function Home() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);

  useEffect(() => {
    (async () => { 
      const user = await getUser();
      console.log("user", user);

      if (!user) {
        router.push("/signin")
        return;
      }
      setSignedIn(true);
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
    console.log(`render page with flashcards from flashcard deck with id of ${flashcardDeckID}`);
  }

  const signout = async() => {
    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Unable to sign in");
      }

      const result = await response.json();
      console.log(result);

      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  }

  if (signedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-20">
        <Header />
        <div className="grid grid-cols-4 gap-8">
          {
            flashcardDecks?.map((deck, index) => (
              <div className="border-primary_blue border-2 px-4 py-4 flex justify-between items-center w-60 cursor-pointer rounded-md" key={index} onClick={() => handleFlashcardDeckClick(deck.id)}>
                <p>{deck.name}</p>
                <p>Length</p>
              </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header />
        <AddFlashCardForm />
      </div>
    )
  }
}
