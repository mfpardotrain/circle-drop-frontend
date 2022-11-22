import Game from "./Game.js";
import GameSocket from './GameSocket';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import "./styles/Pages.css";
import { DefaultCallbackGetRequest } from "./ApiUtils";
import { useGuessState } from "./GuessContext";
import { CopyClipboard } from './CopyClipboard';
import ScoreBoard from './ScoreBoard.js';

const Pages = () => {
    let token = window.location.href.includes("gameId=") && window.location.href.match(/gameId=.*/)[0].split("=")[1];

    let { gameData, setGameData, setStartPos, startPos, winner, setWinner } = useGuessState();
    let [success, setSuccess] = useState(false);

    let initialGameId = () => {
        if (token) {
            localStorage.setItem("game_id", token)
            return token
        };
        if (!!localStorage.getItem("game_id")) {
            return localStorage.getItem("game_id")
        } else {
            let gid = uuidv4()
            localStorage.setItem("game_id", gid)
            return gid
        };
    };

    let [gameId, setGameId] = useState(initialGameId);
    let [guestId, setGuestId] = useState("");
    let [choseName, setChoseName] = useState(false);
    let [gameSocket, setGameSocket] = useState(new GameSocket(guestId, setGameData, setStartPos, setWinner));
    let [copySuccess, setCopySuccess] = useState(false);
    let [connectUrl, setConnectUrl] = useState(false);
    let [isHost, setIsHost] = useState(false);

    let quit = () => {
        gameSocket.sendClose(gameId);
        let gid = uuidv4();
        setGameId(gid);
        localStorage.setItem("game_id", gid);
        window.location = process.env.REACT_APP_CLIENT_URL + "home";
    };

    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setSuccess);

    useEffect(async () => {
        if (!!!gameSocket.socket && choseName) {
            await startWebsocket()
            gameSocket.connect()
        }
        setTimeout(() => {
            if (token && choseName && JSON.stringify(gameData) === "{}") {
                if (gameSocket.socket.readyState === 1) {
                    gameSocket.playerConnect(guestId, gameId)
                }
            }
        }, 500)
    })

    let startGame = () => {
        let payload = {
            "method": "start",
            "gameId": gameData["gameId"],
        }
        gameSocket.send(payload)
    }

    let lobby = () => {
        let players = Object.keys(gameData["data"])

        let rows = players.map(el => {
            return (
                <tr key={el}>
                    <td key={el}>{el}</td>
                </tr>
            )
        })
        return (
            <table className="lobby-table">
                <thead>
                    <tr>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
                {isHost &&
                    <tfoot>
                        <tr>
                            <td>
                                <button className="create-game-button" onClick={() => startGame()}>Start Game</button>
                            </td>
                        </tr>
                    </tfoot>
                }
            </table>
        )
    }

    const handleCreateGameButton = () => {
        let payload = {
            method: "create_game",
            gameId: gameId,
            guestId: guestId,
            data: {
                waiting: false,
                times: []
            },
        }
        gameSocket.send(payload)
        setConnectUrl(process.env.REACT_APP_CLIENT_URL + "home?gameId=" + gameId);
        setIsHost(true);
    };

    const setCopy = (el) => {
        let copyStatusEl = document.getElementById("copy-status")
        let urlBox = document.getElementById("connect-url")
        setCopySuccess(el)
        copyStatusEl.classList.add("fade-out")
        urlBox.classList.add("fade-background")

        var listener = copyStatusEl.addEventListener('animationend', function () {
            copyStatusEl.classList.remove("fade-out");
            copyStatusEl.removeEventListener('animationend', listener);
        })
        var listener2 = urlBox.addEventListener('animationend', function () {
            urlBox.classList.remove("fade-background");
            urlBox.removeEventListener('animationend', listener2);
        })
    }

    let handleEnter = (event) => {
        if (event.key === 'Enter') { document.getElementById('enter-button').click() }
    }
    const chooseName = () => {
        return (
            <div className="choose-name-container">
                <label className="default-label">What's your name?</label>
                <input
                    type="text"
                    value={guestId}
                    onChange={e => setGuestId(e.target.value)}
                    onKeyPress={(e) => handleEnter(e)}
                    className="default-input"
                />
                <button className="create-game-button" id="enter-button" onClick={() => setChoseName(true)}>Save Name</button>
            </div>
        )
    }

    let won = (
        <div className='modal-background'>
            <div className='modal-content winner-container'>
                <span className='winner'>Congratulations you WON!</span>
                <button className='create-game-button new-game-button' onClick={() => quit()}>Exit</button>
            </div>
        </div>
    );

    let lost = (
        <div className='modal-background'>
            <div className='modal-content loser-container'>
                <span className='loser'>Oh no! You Lost.</span>
                <span className='loser'>The winner was {winner}</span>
                <button className='create-game-button new-game-button' onClick={() => quit()}>Exit</button>
            </div>
        </div>
    );

    let endState = winner === guestId ? won : lost

    return (
        <div className="home">
            {!winner && !choseName && chooseName()}
            {!winner && choseName && JSON.stringify(gameData) === "{}" && JSON.stringify(startPos) === "[]" &&
                <button className="create-game-button" onClick={() => handleCreateGameButton()}>Create Game</button>
            }
            {!winner && choseName && JSON.stringify(gameData) !== "{}" && JSON.stringify(startPos) === "[]" &&
                (<>
                    {lobby()}
                    {isHost && <>
                        <div className='connect-url' id='connect-url' onClick={(el) => CopyClipboard(el, setCopy)}>
                            {connectUrl}
                        </div>
                        <div className='copy-status' id='copy-status'>
                        </div>
                    </>
                    }
                </>
                )
            }
            {!winner && choseName && JSON.stringify(startPos) !== "[]" && (
                <>
                    <Game gameSocket={gameSocket} isHost={isHost} guestId={guestId} />
                    <button className='create-game-button quit-button' onClick={() => quit()}>Quit</button>
                </>
            )}
            {winner &&
                <div className="end-container">
                    {endState}
                    {<ScoreBoard className='end-score' />}
                </div>
            }
        </div>
    );
};

export default Pages;
