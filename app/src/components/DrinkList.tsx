"use client";

import React, {useEffect, useState} from "react";
import {FaArrowLeft, FaSearch} from "react-icons/fa";
import type {Drink} from "~/types/drink";

interface DrinkListProps {
    onBack: () => void;
    onSelect: (drink: Drink) => void;
    selectedIngredients: number[] | null;
}

const DrinkList: React.FC<DrinkListProps> = ({
                                                 selectedIngredients,
                                                 onBack,
                                                 onSelect,
                                             }) => {
    const [search, setSearch] = useState("");
    const [drinks, setDrinks] = useState<Drink[]>([]);

    useEffect(() => {
        fetch("/assets/drink_codes.json")
            .then((res) => res.json())
            .then((data) => {
                setDrinks(data);
                console.log("Loaded drinks:", data);
            });
    }, []);

    const filteredDrinks = drinks.filter((drink) => {
        // 🟢 Adjust this line if needed
        const codes = drink.codes?.map(Number) ?? [];
        // Example if your JSON uses "ingredients":
        // const codes = drink.ingredients?.map(Number) ?? [];

        // For debugging:
        console.log(`Drink "${drink.name}" codes:`, codes);
        console.log("Selected ingredients:", selectedIngredients);

        const matchIngredients =
            selectedIngredients && selectedIngredients.length > 0
                ? selectedIngredients.every((code) => codes.includes(code))
                : true;

        const matchSearch = drink.name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchIngredients && matchSearch;
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top bar */}
            <div className="bg-sky-400 p-4 flex items-center justify-between">
                <button onClick={onBack} className="text-white">
                    <FaArrowLeft size={20}/>
                </button>
                <h2 className="text-white text-lg font-semibold">
                    {selectedIngredients && selectedIngredients.length > 0
                        ? "Drinks filtrati"
                        : "Lista Drinks"}
                </h2>
                <div className="w-5"/>
            </div>

            {/* Search bar */}
            <div className="p-4 bg-sky-400">
                <div className="flex items-center bg-white rounded-full px-3 py-2">
                    <FaSearch className="text-gray-500 mr-2"/>
                    <input
                        type="text"
                        placeholder="Search for a drink"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 outline-none"
                    />
                </div>
            </div>

            {/* Drink grid */}
            <div className="grid grid-cols-2 gap-4 p-4">
                {filteredDrinks.map((drink) => (
                    <div
                        key={drink.code}
                        className="flex flex-col items-center space-y-2 bg-white rounded shadow p-2 cursor-pointer"
                        onClick={() => onSelect(drink)}
                    >
                        <img
                            src={drink.img}
                            alt={drink.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <span className="text-center text-sm font-medium">
              {drink.name}
            </span>
                    </div>
                ))}

                {filteredDrinks.length === 0 && (
                    <p className="text-gray-500 text-center w-full col-span-2 mt-8">
                        Nessun drink trovato con questi ingredienti.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DrinkList;
