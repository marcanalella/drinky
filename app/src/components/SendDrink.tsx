"use client";

import React, { useState } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { FaArrowLeft, FaGift } from "react-icons/fa";

interface SendDrinkProps {
    onBack: () => void;
}

export const SendDrink: React.FC<SendDrinkProps> = ({ onBack }) => {
    const { profile, isAuthenticated } = useProfile();
    const [recipient, setRecipient] = useState("");

    const sendUsdc = () => {
        if (!recipient) {
            alert("Please enter a recipient FID or username.");
            return;
        }
        // This is a placeholder for USDC transfer logic
        alert(`Pretend we are sending 5 USDC to ${recipient}`);
    };

    if (!isAuthenticated || !profile) {
        return (
            <div className="p-4">
                <p className="text-red-500">Please sign in with Farcaster first.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-purple-500 p-4 flex items-center">
                <button onClick={onBack} className="text-white mr-2">
                    <FaArrowLeft />
                </button>
                <h2 className="text-white text-lg font-semibold">Buy a Drink to a Friend</h2>
            </div>
            <div className="p-4 space-y-4">
                <label className="block">
                    <span className="text-gray-700">Recipient Username or FID</span>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="e.g., alice or 1234"
                    />
                </label>
                <button
                    onClick={sendUsdc}
                    className="flex items-center justify-center space-x-2 bg-purple-500 text-white py-3 w-full rounded"
                >
                    <FaGift />
                    <span>Send 5 USDC</span>
                </button>
            </div>
        </div>
    );
};

export default SendDrink;