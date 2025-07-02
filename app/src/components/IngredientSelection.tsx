// src/components/IngredientSelection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import type { Ingredient } from "~/types/ingredient";

interface IngredientSelectionProps {
    onSearch: (selectedCodes: number[]) => void;
    onBack: () => void;
}

export const IngredientSelection: React.FC<IngredientSelectionProps> = ({ onSearch, onBack }) => {
    const [ingredients, setIngredients] = useState<Record<number, Ingredient>>({});
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch("/assets/ingredient_codes.json")
            .then((res) => res.json())
            .then((data) => {
                const parsed: Record<number, Ingredient> = {};
                Object.entries(data).forEach(([key, val]) => {
                    parsed[Number(key)] = val as Ingredient;
                });
                setIngredients(parsed);
            });
    }, []);

    const toggle = (code: number) => {
        const copy = new Set(selected);
        copy.has(code) ? copy.delete(code) : copy.add(code);
        setSelected(copy);
    };

    return (
        <div className="min-h-screen flex flex-col pb-20 relative">
            <div className="bg-sky-400 p-4 flex items-center">
                <button onClick={onBack} className="text-white mr-2">
                    <FaArrowLeft size={20} />
                </button>
                <h2 className="text-white text-lg font-semibold">Scegli Ingredienti</h2>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                {Object.entries(ingredients).map(([key, ing]) => {
                    const code = Number(key);
                    const isSel = selected.has(code);
                    return (
                        <label
                            key={code}
                            className={`flex flex-col items-center space-y-2 p-2 border rounded cursor-pointer ${
                                isSel ? "bg-sky-100 border-sky-400" : "bg-white"
                            }`}
                        >
                            <div className="w-20 h-20 flex items-center justify-center bg-white rounded overflow-hidden">
                                <img
                                    src={`assets/bottles/${ing.name}.png`}
                                    alt={ing.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isSel}
                                    onChange={() => toggle(code)}
                                />
                                <span>{ing.name}</span>
                            </div>
                        </label>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200">
                <button
                    onClick={() => onSearch(Array.from(selected))}
                    className="w-full flex items-center justify-center space-x-2 bg-sky-400 text-white py-3 rounded"
                >
                    <FaSearch />
                    <span>Cerca Drinks</span>
                </button>
            </div>
        </div>
    );
};

export default IngredientSelection;