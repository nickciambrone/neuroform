"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
export function Navbar() {
    const isAuthenticated = false;

    return (
        <div className="px-5 py-6 flex justify-between items-center max-w-6xl mx-auto w-full">




            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Neuroform
            </h1>

            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <UserCircle className="h-8 w-8 text-primary" />

                ) : (
                    <div className="flex space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => alert("Trigger login flow")}>
                            Log In
                        </Button>
                        <Button variant="default" size="sm" onClick={() => alert("Trigger sign up flow")}>
                            Sign Up
                        </Button>
                    </div>


                )}
            </div>
        </div>
    );
}
