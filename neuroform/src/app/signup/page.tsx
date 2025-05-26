"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const continueWithEmail = () => {
    if (!email) return;
    setStep("password");
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/reader");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/reader");
  };

  return (
    <div className="min-h-screen flex justify-center bg-white dark:bg-black px-4" style={{paddingTop:'100px'}}>
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">
          Create an account
        </h1>

        {step === "email" ? (
          <>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full rounded-full" onClick={continueWithEmail}>
              Continue
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log in
              </a>
            </p>
          </>
        ) : (
          <>
            <Input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full rounded-full" onClick={handleSignup}>
              Sign up
            </Button>
          </>
        )}

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
          <span>or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full rounded-full"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
