'use client'

import Image from "next/image";
import Header from "./components/header";
import Flashcard from "./components/flashcards";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import AddFlashCardForm from "./components/addflashcard";

export default function Home() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => { 
      const user = await getUser();
      console.log("user", user);
      setEmail(user);

      if (!user) {
        router.push("/signin")
        return;
      }
      setSignedIn(true);
    })()
  })

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

  const signout = async() => {
    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email
        }),
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
      <div>
        <Header />
        You are signed in!
        <AddFlashCardForm />
        <button onClick={() => signout()}>Sign out</button>
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
