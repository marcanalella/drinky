"use client";

import React, {useCallback, useState} from "react";
import {SignIn as SignInCore} from "@farcaster/frame-core/dist/actions";
import {getCsrfToken, signIn, signOut, useSession} from "next-auth/react";
import sdk from "@farcaster/frame-sdk";
import {Button} from "~/components/ui/Button";


export function SignIn() {
    const [signingIn, setSigningIn] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
    const [signInFailure, setSignInFailure] = useState<string>();
    const {data: session, status} = useSession();

    const getNonce = useCallback(async () => {
        const nonce = await getCsrfToken();
        if (!nonce) throw new Error("Unable to generate nonce");
        return nonce;
    }, []);

    const handleSignIn = useCallback(async () => {
        try {
            setSigningIn(true);
            setSignInFailure(undefined);
            const nonce = await getNonce();
            const result = await sdk.actions.signIn({nonce});
            setSignInResult(result);

            await signIn("credentials", {
                message: result.message,
                signature: result.signature,
                redirect: false,
            });
        } catch (e) {
            if (e instanceof SignInCore.RejectedByUser) {
                setSignInFailure("Rejected by user");
                return;
            }

            setSignInFailure("Unknown error");
        } finally {
            setSigningIn(false);
        }
    }, [getNonce]);

    const handleSignOut = useCallback(async () => {
        try {
            setSigningOut(true);
            await signOut({redirect: false});
            setSignInResult(undefined);
        } finally {
            setSigningOut(false);
        }
    }, []);

    return (

        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Welcome to Drinky!</h1>
            </div>

            <div className="w-48">
                <img
                    src="/animated_logo.gif"
                    alt="Drinky"
                    className="w-full h-auto"
                />
            </div>

            {status !== "authenticated" && (
                <Button onClick={handleSignIn} disabled={signingIn}>
                    Sign In with Farcaster
                </Button>
            )}
            {status === "authenticated" && (
                <Button onClick={handleSignOut} disabled={signingOut}>
                    Sign out
                </Button>
            )}
            {session && (
                <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
                    <div className="font-semibold text-gray-500 mb-1">Session</div>
                    <div className="whitespace-pre">
                        {JSON.stringify(session, null, 2)}
                    </div>
                </div>
            )}
            {signInFailure && !signingIn && (
                <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
                    <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
                    <div className="whitespace-pre">{signInFailure}</div>
                </div>
            )}
            {signInResult && !signingIn && (
                <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 rounded-lg font-mono">
                    <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
                    <div className="whitespace-pre">
                        {JSON.stringify(signInResult, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignIn;