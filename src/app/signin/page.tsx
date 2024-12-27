import React from "react"
import SigninBox from "../components/signin"
import Header from "../components/header"

export default function Signup() {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <SigninBox />
        </div>
    )
}