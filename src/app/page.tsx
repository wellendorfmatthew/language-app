'use client'

import Image from "next/image";
import Header from "./components/header";
import Flashcard from "./components/flashcards";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      console.log("user", user);

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

  if (signedIn) {
    return (
      <div>
        <Header />
        You are signed in!
      </div>
    );
  } else {
    return (
      <div>
        <Header />
      </div>
    )
  }
}
