import React from "react";
import Link from "next/link";

export default function SignupBox() {
    return (
        <div className="w-[400px] h-[500px] flex flex-col gap-8 justify-center items-center border-2 border-primary_blue mt-16 rounded-xl">
            <h1 className="text-4xl">Sign Up</h1>
            <div className="flex flex-col gap-4 w-4/5">
                <input className="py-4 px-4 ml-2 bg-gray-100 rounded-xl outline-none" placeholder="Email Address" />
                <input className="py-4 px-4 ml-2 bg-gray-100 rounded-xl outline-none" placeholder="Password" />
            </div>
            <button className="px-4 py-4 bg-primary_blue rounded-xl shadow-xl hover:brightness-105 text-white">Create Account</button>
            <p>Already have an account? <Link href="/signin" className="text-primary_blue hover:underline">Sign in</Link></p>
        </div>
    )
}