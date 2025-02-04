'use client'

import Image from "next/image";
import Header from "./components/header";
import Flashcard from "./components/flashcards";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import AddFlashCardForm from "./components/addflashcard";
import { FlashcardDeck } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import Plus from "../../public/plus-button.png";
import Edit from "../../public/edit-button.png";
import Trash from "../../public/trash-can-small.png";

export default function Home() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [newDeckName, setNewDeckName] = useState("");

  const createFlashcardDeck = async(name: string) => {
    console.log(name);
    try {
        const response = await fetch("/api/addFlashCardDeck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userID: "d01c6a29-fab1-403e-af5c-2812f3f97fb0", // Later change to actual userID value
              name: name
            })
        });

        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message);
        }

        const json = await response.json();
        console.log(json);
        console.log(json.data);

        setFlashcardDecks([...flashcardDecks, json.data]);
        setNewDeckName("");

        return json.data;
    } catch (error: any) {
        console.log(error);
    }
}

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

  const editFlashcardDeck = async(flashcardDeckID: string, name: string) => {
    console.log(name);
    try {
        const response = await fetch("/api/updateFlashCardDeck", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userID: "d01c6a29-fab1-403e-af5c-2812f3f97fb0", // Later change to actual userID value
              flashcardDeckID: flashcardDeckID,
              name: name
            })
        });

        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message);
        }

        const json = await response.json();
        console.log(json);
        console.log(json.data);

        setFlashcardDecks((prev) =>
          prev.map((card) =>
            card.id === flashcardDeckID ? { ...card, name: name } : card
          )
        )

        return json.data;
    } catch (error: any) {
        console.log(error);
    }
  }

  const deleteFlashcardDeck = async(flashcardDeckID: string) => {
    try {
        const response = await fetch("/api/deleteFlashCardDeck", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userID: "d01c6a29-fab1-403e-af5c-2812f3f97fb0", // Later change to actual userID value
              flashcardDeckID: flashcardDeckID
            })
        });

        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message);
        }

        const json = await response.json();
        console.log(json);
        console.log(json.data);

        const newFlashcardDeck = flashcardDecks.filter((card) => card.id !== flashcardDeckID);
        setFlashcardDecks(newFlashcardDeck);

        return json.data;
    } catch (error: any) {
        console.log(error);
    }
  }

  const handleFlashcardDeckClick = (flashcardDeckID : string) => {
    router.push(`flashcards/${flashcardDeckID}`);
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
        <Dialog>
                <DialogTrigger asChild>
                <button className="flex justify-center items-center p-4 rounded-full">
                    <Image src={Plus} alt="+" />
                </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription>
                            Create a new flashcard deck
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="deckname" className="text-right">
                            Name
                            </label>
                            <input
                            id="deckname"
                            className="col-span-3"
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <button onClick={() => createFlashcardDeck(newDeckName)}>Save changes</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          {
            flashcardDecks?.map((deck, index) => (
              <div className="border-primary_blue border-2 px-4 py-4 flex justify-between items-center w-60 cursor-pointer rounded-md flex-col gap-8" key={index}>
                <div className="flex justify-center items-center gap-4">
                  <Dialog>
                      <DialogTrigger asChild>
                      <button className="flex justify-center items-center p-4 rounded-full">
                          <Image src={Edit} alt="e" />
                      </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                              <DialogTitle></DialogTitle>
                              <DialogDescription>
                                  Edit the flashcard deck
                              </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="deckname" className="text-right">
                                  Name
                                  </label>
                                  <input
                                  id="deckname"
                                  className="col-span-3"
                                  value={deck.name}
                                  onChange={(e) => setFlashcardDecks((prev) => prev.map((card) => card.id === deck.id ? { ...card, name: e.target.value } : card))}
                                  />
                              </div>
                          </div>
                          <DialogFooter>
                              <button onClick={() => editFlashcardDeck(deck.id, deck.name)}>Save changes</button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
                  <button className="flex justify-center items-center p-4 rounded-full" onClick={() => deleteFlashcardDeck(deck.id)}>
                    <Image src={Trash} alt="d" />
                  </button>
                </div>
                <p onClick={() => handleFlashcardDeckClick(deck.id)}>{deck.name}</p>
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
