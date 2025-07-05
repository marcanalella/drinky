// src/components/DrinkyPage.jsx

import React from "react";
import {FaSearch, FaList, FaImage} from "react-icons/fa";
import {SignInButton, useProfile} from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";


interface HomeProps {
    onShowDrinkList: () => void;
    onSearchByIngredients: () => void;
    onMintNft: () => void;
}


const Home: React.FC<HomeProps> = ({onShowDrinkList, onSearchByIngredients, onMintNft}) => {

    const {isAuthenticated} = useProfile();

    return (

        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Hi, I'm Drinky!</h1>
                <h2 className="text-xl">What can I do for you?</h2>
            </div>

            <div className="w-48">
                <img
                    src="/animated_logo.gif"
                    alt="Drinky"
                    className="w-full h-auto"
                />
            </div>

            {!isAuthenticated && (
                <div>
                    <SignInButton/>
                </div>
            )}

            <div className="w-full max-w-md flex flex-col space-y-4 mt-4">

                {isAuthenticated && (<button
                    onClick={onSearchByIngredients}
                    className="flex items-center justify-between bg-white rounded-full shadow px-4 py-3 text-left hover:bg-gray-100">
                    <span>Search for a drink by ingredients</span>
                    <FaSearch className="text-gray-600"/>
                </button>)}

                {isAuthenticated && (
                    <button onClick={onShowDrinkList}
                            className="flex items-center justify-between bg-white rounded-full shadow px-4 py-3 text-left hover:bg-gray-100">
                        <span>Drink list</span>
                        <FaList className="text-gray-600"/>
                    </button>)}

                {isAuthenticated && (
                    <button
                        onClick={onMintNft}
                        className="flex items-center justify-between bg-white rounded-full shadow px-4 py-3 text-left hover:bg-gray-100">
                        <span>LIMITED! Mint Drinky NFT :)</span>
                        <FaImage className="text-gray-600"/>
                    </button>
                )}

            </div>
        </div>
    );
};

export default Home;