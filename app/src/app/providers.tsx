"use client";

import dynamic from "next/dynamic";
import type {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {MiniAppProvider} from "@neynar/react";
import {SafeFarcasterSolanaProvider} from "~/components/providers/SafeFarcasterSolanaProvider";
import {AuthKitProvider} from "@farcaster/auth-kit";

const WagmiProvider = dynamic(
    () => import("~/components/providers/WagmiProvider"),
    {
        ssr: false,
    }
);

export function Providers({session, children}: { session: Session | null, children: React.ReactNode }) {
    const solanaEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://solana-rpc.publicnode.com";
    const config = {
        relay: "https://relay.farcaster.xyz",
        rpcUrl: "https://mainnet.optimism.io",
        domain: "example.com",
        siweUri: "https://example.com/login",
    };
    return (
        <SessionProvider session={session}>
            <AuthKitProvider config={config}>
                <WagmiProvider>
                    <MiniAppProvider analyticsEnabled={true} backButtonEnabled={true}>
                        <SafeFarcasterSolanaProvider endpoint={solanaEndpoint}>
                            {children}
                        </SafeFarcasterSolanaProvider>
                    </MiniAppProvider>
                </WagmiProvider>
            </AuthKitProvider>
        </SessionProvider>
    );
}
