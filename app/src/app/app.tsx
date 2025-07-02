"use client";

import dynamic from "next/dynamic";
import React, {useState} from "react";
import type {Drink} from "~/types/drink";
import {SignInButton, useProfile} from "@farcaster/auth-kit";


// Dynamic imports
const Demo = dynamic(() => import("~/components/Demo"), {ssr: false});
const Home = dynamic(() => import("~/components/Home"), {ssr: false});
const DrinkList = dynamic(() => import("~/components/DrinkList"), {ssr: false});
const DrinkDetail = dynamic(() => import("~/components/DrinkDetails"), {ssr: false});
const IngredientSelection = dynamic(() => import("~/components/IngredientSelection")
    .then((mod) => mod.IngredientSelection), {ssr: false});
const SendDrink = dynamic(() => import("~/components/SendDrink"), {ssr: false});
const SignIn = dynamic(() => import("~/components/SignIn"), {ssr: false});

export default function App() {
    const [view, setView] = useState<"home" | "list" | "ingredients" | "details" | "send">("home");
    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<number[] | null>(null);
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const {profile, isAuthenticated} = useProfile();

    // Load drinks JSON once
    const loadDrinks = () => {
        if (drinks.length === 0) {
            fetch("/assets/drink_codes.json")
                .then((r) => r.json())
                .then((data) => setDrinks(data));
        }
    };

    // Debug output - REMOVE later
    console.log("useProfile()", { isAuthenticated, profile });

    // Show loading if undefined
    if (typeof isAuthenticated === "undefined") {
        return <p>Loading...</p>;
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div>
                <SignIn />
            </div>
        );
    }

    return (
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
    );
}
