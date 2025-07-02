// src/components/DrinkDetail.tsx
"use client";

import React from "react";
import {FaArrowLeft} from "react-icons/fa";
import type {Drink} from "~/types/drink";

interface DrinkDetailProps {
    drink: Drink;
    onBack: () => void;
}

const DrinkDetail: React.FC<DrinkDetailProps> = ({drink, onBack}) => (
    <div className="min-h-screen flex flex-col">
        {/* Top bar with back */}
        <div className="bg-sky-400 p-4 flex items-center">
            <button onClick={onBack} className="text-white">
                <FaArrowLeft size={20}/>
            </button>
            <h2 className="text-white text-lg font-semibold ml-4">
                {drink.name}
            </h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
            <img
                src={drink.img}
                alt={drink.name}
                className="w-full max-w-sm mx-auto object-cover rounded"
            />

            <div>
                <h3 className="font-semibold">Category</h3>
                <p>{drink.category}</p>
            </div>

            <div>
                <h3 className="font-semibold">Ingredients</h3>
                <p>{drink.ingredients}</p>
            </div>

            <div>
                <h3 className="font-semibold">Doses</h3>
                <p>{drink.doses}</p>
            </div>

            <div>
                <h3 className="font-semibold">Preparation</h3>
                <p>{drink.preparation}</p>
            </div>

            <div>
                <h3 className="font-semibold">Story</h3>
                <p>{drink.story}</p>
            </div>
        </div>
    </div>
);

export default DrinkDetail;
