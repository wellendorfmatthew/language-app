'use client'

import React, { useEffect, useState } from "react";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function GameModes() {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center gap-16">
            <Header />
            <div className="flex gap-8">
                <div className="w-[300px] h-[200px] border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer" onClick={() => router.push("/getFlashcards")}>
                    Viewing
                </div>
                <div className="w-[300px] h-[200px] border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer" onClick={() => router.push("/learning-game")}>
                    Learning
                </div>
                <div className="w-[300px] h-[200px] border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer" onClick={() => router.push("/matching-game")}>
                    Matching
                </div>
            </div>
        </div>
    )
}