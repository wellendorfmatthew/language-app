import Image from "next/image";
import Header from "./components/header";
import Flashcard from "./components/flashcards";

export default function Home() {
  return (
    <div>
      <Header />
      <Flashcard />
    </div>
  );
}
