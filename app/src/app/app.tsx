"use client";

import dynamic from "next/dynamic";
import React, {useState} from "react";
import type {Drink} from "~/types/drink";
import {AuthKitProvider, useProfile} from "@farcaster/auth-kit";


// Dynamic imports
const Home = dynamic(() => import("~/components/Home"), {ssr: false});
const DrinkList = dynamic(() => import("~/components/DrinkList"), {ssr: false});
const DrinkDetail = dynamic(() => import("~/components/DrinkDetails"), {ssr: false});
const IngredientSelection = dynamic(() => import("~/components/IngredientSelection")
    .then((mod) => mod.IngredientSelection), {ssr: false});
const SendDrink = dynamic(() => import("~/components/SendDrink"), {ssr: false});

export default function App() {
    const [view, setView] = useState<"home" | "list" | "ingredients" | "details" | "send">("home");
    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<number[] | null>(null);
    const [drinks, setDrinks] = useState<Drink[]>([]);

    // Load drinks JSON once
    const loadDrinks = () => {
        if (drinks.length === 0) {
            fetch("/assets/drink_codes.json")
                .then((r) => r.json())
                .then((data) => setDrinks(data));
        }
    };

    const config = {
        relay: "https://relay.farcaster.xyz",
        // For a production app, replace this with an Optimism Mainnet
        // RPC URL from a provider like Alchemy or Infura.
        rpcUrl: "https://mainnet.optimism.io",
        domain: "example.com",
        siweUri: "https://example.com/login",
    };

    return (
        <AuthKitProvider config={config}>
            <div>
                {view === "home" && (
                    <Home
                        onShowDrinkList={() => {
                            loadDrinks();
                            setView("list");
                        }}
                        onSearchByIngredients={() => {
                            loadDrinks();
                            setView("ingredients");
                        }}
                        onSendDrinkToFriend={() => setView("send")}
                    />
                )}

                {view === "ingredients" && (
                    <IngredientSelection
                        onBack={() => setView("home")}
                        onSearch={(codes) => {
                            setSelectedIngredients(codes);
                            setView("list");
                        }}
                    />
                )}


                {view === "list" && (
                    <DrinkList
                        onBack={() => setView("home")}
                        onSelect={(drink) => {
                            setSelectedDrink(drink);
                            setView("details");
                        }}
                        selectedIngredients={selectedIngredients}
                    />
                )}

                {view === "details" && selectedDrink && (
                    <DrinkDetail drink={selectedDrink} onBack={() => {
                        setView("list")
                    }}
                    />
                )}

                {view === "send" && (
                    <SendDrink onBack={() => setView("home")}/>
                )}
            </div>
        </AuthKitProvider>
    );
}
