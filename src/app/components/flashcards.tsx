'use client'

import React, { useState } from "react";

export default function Flashcard() {
    const [facingFront, setFacingFront] = useState(true);

    const handleClick = () => {
        setFacingFront(!facingFront)
    }

    return (
        <div className="flip-card mt-20 ml-8 cursor-pointer" onClick={handleClick}>
            <div className={`flip-card-inner ${!facingFront ? "flipped" : ""}`}>
                <div className="flip-card-front bg-primary_blue rounded-xl">
                    <p>How are you</p>
                </div>
                <div className="flip-card-back bg-primary_blue rounded-xl">
                    <p>Comment ca va</p>
                </div>
            </div>
        </div>
    )
}