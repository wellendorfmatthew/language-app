import React from "react"
import SignupBox from "../components/signup"
import Header from "../components/header"

export default function Signup() {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <SignupBox />
        </div>
    )
}