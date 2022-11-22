import React, { useContext, useState, createContext, } from 'react';

export const GuessContext = createContext({
    "gameData": {}
});

export const GuessContextWrapper = ({ children }) => {
    const [gameData, setGameDataState] = useState({});
    const [success, setSuccess] = useState(false);
    const [startPos, setStartPos] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [hasLost, setHasLost] = useState(false);
    const [winner, setWinner] = useState(false);

    const checkWaiting = (gameData) => {
        setIsWaiting(Object.values(gameData["data"]).every((value, _index, arr) => {
            return value["waiting"] === true
        }))
    }

    const setGameData = (gameData) => {
        setGameDataState(gameData)
        checkWaiting(gameData)
    }

    return (
        <GuessContext.Provider
            value={{
                "gameData": gameData,
                "setGameData": setGameData,
                "success": success,
                "setSuccess": setSuccess,
                "startPos": startPos,
                "setStartPos": setStartPos,
                "isWaiting": isWaiting,
                "checkWaiting": checkWaiting,
                "hasLost": hasLost,
                "setHasLost": setHasLost,
                "winner": winner,
                "setWinner": setWinner,
            }}
        >
            {children}
        </GuessContext.Provider>
    );
};

export const useGuessState = () => useContext(GuessContext);