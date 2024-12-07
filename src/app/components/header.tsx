import React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <div className="w-screen h-16 bg-primary_blue flex items-center justify-between">
            <h1 className="text-3xl text-white ml-4">Lingua</h1>
            <Link href="/" className="text-white mr-8">Signin/Signup</Link>
        </div>
    )
}