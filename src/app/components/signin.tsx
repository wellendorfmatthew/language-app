'use client'

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SigninBox() {
    const [error, setError] = useState("");
    const router = useRouter();
    const UserSchema = z.object({
        email: z.
            string().
            email({message: "Must be a valid email address"}),
        password: z.
            string()
    })
    type User = z.infer<typeof UserSchema>;
    const { register, handleSubmit, formState: { errors }, } = useForm<User>({resolver: zodResolver(UserSchema)});

    const handleSignin = async(email: string, password: string) => {
        try {
            const response = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.message);
                throw new Error(json.message);
            }
    
            const json = await response.json();
            console.log(json);
            setError("");
            router.push("/");
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <form 
            className="w-[400px] h-[500px] flex flex-col gap-8 justify-center items-center border-2 border-primary_blue mt-16 rounded-xl"
            onSubmit={handleSubmit((data) => handleSignin(data.email, data.password))}>
            <h1 className="text-4xl">Sign In</h1>
            <div className="flex flex-col w-4/5">
                <input 
                    className="py-4 px-4 ml-2 bg-gray-100 rounded-xl outline-none" 
                    placeholder="Email Address"
                    type="email"
                    {...register('email')}
                />
                <span className="w-[316.8px] h-[24px] text-red-600">{errors?.email && errors.email.message}</span>
                <input 
                    className="py-4 px-4 ml-2 bg-gray-100 rounded-xl outline-none" 
                    placeholder="Password"
                    type="password"
                    {...register('password')}
                />
                <span className="w-[316.8px] h-[24px] text-red-600">{errors?.password && errors.password.message}</span>
            </div>
            <button 
                className="px-4 py-4 bg-primary_blue rounded-xl shadow-xl hover:brightness-105 text-white"
                type="submit"
            >
                Login
            </button>
            <span className="w-[316.8px] h-[24px] text-red-600">{error && error}</span>
            <p>Already have an account? <Link href="/signup" className="text-primary_blue hover:underline">Sign up</Link></p>
        </form>
    )
}