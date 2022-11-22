import GameSocket from './GameSocket';
import { useEffect, useState } from 'react';
import "./styles/Pages.css";
import "./styles/Admin.css";
import { DefaultCallbackGetRequest } from "./ApiUtils";

const Admin = () => {
    let [data, setData] = useState("");
    let setGames = (data) => {
        console.log("set games", data)
        return (
            data &&
            Object.keys(data).map(gameId => {
                return Object.keys(data[gameId]).map(guestId => {
                    return (
                        <tr>
                            <td>{gameId}</td>
                            <td>{guestId}</td>
                            <td><button className="del-button" onClick={() => gameSocket.sendClose(gameId)}>X</button></td>
                        </tr>
                    )
                })
            })
        )
    };

    let [gameSocket, setGameSocket] = useState(new GameSocket(false, setData, false, false, true));
    const startWebsocket = DefaultCallbackGetRequest("startWebsocket/", "", setData);

    useEffect(async () => {
        if (!!!gameSocket.socket) {
            await startWebsocket()
            gameSocket.connect()
        }
        if (data.length === 0) {
            setTimeout(() => {
                if (gameSocket.socket.readyState === 1) {
                    gameSocket.getGamestate()
                }
            }, 100)
        }
    })

    return (
        <>
            <button onClick={async () => await gameSocket.getAllGames()}>Get Games</button>
            <table>
                <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Guest ID</th>
                        <th>Delete Game</th>
                    </tr>
                </thead>
                <tbody>
                    {setGames(data)}
                </tbody>
            </table>
        </>
    );
};

export default Admin;
