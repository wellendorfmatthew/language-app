import React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <div className="w-screen h-16 bg-primary_blue flex items-center justify-between">
            <Link href="/" className="text-3xl text-white ml-4">Lingua</Link>
            <div className="flex justify-center items-center gap-4">
                <Link href="/" className="text-white mr-8">Signin</Link>
                <Link href="/" className="text-white mr-8">Signup</Link>
            </div>
        </div>
    )
}