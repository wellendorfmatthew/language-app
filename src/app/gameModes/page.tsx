'use client'

import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { Flashcard } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ViewingIcon from "../../../public/viewingicon.png";
import MatchingIcon from "../../../public/matchingicon.png";
import LearningIcon from "../../../public/learningicon.png";
import WritingIcon from "../../../public/writing.png";
import MultipleIcon from "../../../public/multiple_choice.png";
import TrueIcon from "../../../public//true_false.png";

export default function GameModes() {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center gap-16">
            <Header />
            <div className="flex flex-col gap-8 justify-center items-center">
                <h1 className="font-bold text-3xl">Game Modes</h1>
                <div className="grid grid-cols-3 gap-16">
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/matching-game/deckChoice")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={MatchingIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">Matching</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/learning-game/deckChoice")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={LearningIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">Learning</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/getFlashcards")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={ViewingIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">Viewing</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/writing-test/deckChoice")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={WritingIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">Writing</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/multiple-choice/deckChoice")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={MultipleIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">Multiple Choice</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4" onClick={() => router.push("/true-false/deckChoice")}>
                        <div className="border-primary_blue border-2 rounded-lg flex justify-center items-center cursor-pointer py-8 px-10 hover:shadow-lg">
                            <Image src={TrueIcon} alt="viewing" />
                        </div>
                        <p className="text-xl font-semibold">True or False</p>
                    </div>
                </div>
            </div>
        </div>
    )
}