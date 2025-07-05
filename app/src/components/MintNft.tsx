"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { FaSpinner } from "react-icons/fa";

const CONTRACT_ADDRESS = "0xYourNFTContract";
//const ABI = [/* your contract ABI */];

export default function MintNFT({ onBack }: { onBack: () => void }) {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mintNFT = async () => {
        try {
            setLoading(true);
            setError(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, "ABI", signer);

            const tx = await contract.mint();
            const receipt = await tx.wait();

            setTxHash(receipt.hash);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to mint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center space-y-6">
            <h2 className="text-2xl font-bold">Mint Your Drinky NFT</h2>

            <div className="w-48">
                <img
                    src="/logo.png"
                    alt="Drinky"
                    className="w-full h-auto"
                />
            </div>

            <button
                onClick={mintNFT}
                disabled={loading}
                className="bg-sky-400 text-white px-6 py-3 rounded-full hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        Minting...
                    </>
                ) : (
                    "Mint Now"
                )}
            </button>

            {txHash && (
                <p className="text-green-500 break-all">
                    Minted! Tx: {txHash}
                </p>
            )}

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            <button
                onClick={onBack}
                className="text-sm text-gray-500 underline"
            >
                ← Back
            </button>
        </div>
    );
}
