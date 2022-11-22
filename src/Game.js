import { useState, useEffect } from 'react';
import Shape from './Shape.js';
import "./styles/Game.css";
import "./styles/Shape.css";
import { useGuessState } from "./GuessContext";
import ScoreBoard from './ScoreBoard.js';

const Game = (props) => {
    let { startPos, gameData, isWaiting, winner } = useGuessState();
    let { gameSocket, isHost, guestId, } = props;

    let [xPos, setXPos] = useState(startPos[2]);
    let [yPos, setYPos] = useState(startPos[3]);

    let [dropXPos, setDropXPos] = useState(startPos[2]);
    let [dropYPos, setDropYPos] = useState(startPos[3]);
    let [relX, setRelX] = useState(0);
    let [relY, setRelY] = useState(0);
    let [height, setHeight] = useState(100);
    let [width, setWidth] = useState(100);
    let [isDragging, setIsDragging] = useState(false);
    let [canDrag, setCanDrag] = useState(false);
    let [clickable, setClickable] = useState(true);
    let [reset, setReset] = useState(false);

    let [targetX, setTargetX] = useState(startPos[0]);
    let [targetY, setTargetY] = useState(startPos[1]);
    let player = new Shape(xPos, yPos, dropXPos, dropYPos, height, width, relX, relY, isDragging, false);
    let target = new Shape(targetX, targetY, targetX, targetY, height, width, 0, 0, false, true);

    let getMousePos = (event) => {
        setXPos(event.clientX)
        setYPos(event.clientY)
    };

    let handleMouseDown = (event) => {
        if (canDrag) {
            setIsDragging(true)
        }
    }

    let delay = (i, el) => {
        setTimeout(() => {
            el.innerHTML = i == 0 ? "Start" : i;
        }, Math.abs(i - 3) * 1000)
    }

    let sendFinish = async () => {
        var unclickDiv = document.getElementById('unclickable');
        let payload = {
            method: "update_gamestate",
            gameId: gameData["gameId"],
            guestId: guestId,
            data: {
                waiting: true,
                times: [],
                size: [player.height, player.width],
            }
        }
        await gameSocket.send(payload)
        setReset(true)
        setTimeout(() => {
            unclickDiv.style.opacity = "100%"
        }, 2000)
    }

    let kickOffGame = () => {
        var unclickDiv = document.getElementById('unclickable');
        if (!winner) {
            setTimeout(() => {
                setDropXPos(startPos[2])
                setDropYPos(startPos[3])

                setTargetX(startPos[0])
                setTargetY(startPos[1])

                for (let i = 4; i > -1; i--) {
                    if (unclickDiv) {
                        delay(i, unclickDiv)
                    }
                }
            }, 6000)
            setTimeout(() => {
                setClickable(true)
                if (isHost) {
                    gameSocket.sendResetWaiting(gameData["gameId"])
                }
            }, 9400)
            if (!gameData["data"][guestId]["hasLost"]) {
                setRelX(0)
                setRelY(0)
                setIsDragging(false)
                setCanDrag(false)
                setReset(false)
            }
        }
    }

    let calculateOverlapPos = (event) => {
        let xPos = Math.max(event.clientX - relX, targetX)
        let yPos = Math.max(event.clientY - relY, targetY)
        setDropXPos(xPos)
        setDropYPos(yPos)
        setTargetX(xPos)
        setTargetY(yPos)
    }

    let handleMouseUp = async (event) => {
        if (isDragging && canDrag) {
            let size = player.findOverlap(event.clientX - relX, event.clientY - relY, target)
            setIsDragging(false)
            if (!size) {
                setDropXPos(event.clientX - relX)
                setDropYPos(event.clientY - relY)
                return
            }
            setClickable(false)
            calculateOverlapPos(event)
            setHeight(size[0])
            setWidth(size[1])
            if (reset == false) {
                await sendFinish()
            }
        }
    }

    useEffect(() => {
        if (isWaiting && reset && !winner) {
            kickOffGame()
        }
    })

    useEffect(() => {
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        let playerDiv = document.getElementById('player')
        playerDiv.onmouseover = () => {
            setCanDrag(true)
        }
        playerDiv.onmouseout = () => {
            !isDragging && setCanDrag(false)
        }
        setRelX(xPos - dropXPos)
        setRelY(yPos - dropYPos)
        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
        };
    }, [canDrag, isDragging])

    useEffect(() => {
        window.addEventListener('mousemove', getMousePos);
        return () => {
            window.removeEventListener('mousemove', getMousePos)
        }
    }, [])

    return (
        <div className="game-container">
            {!clickable && <ScoreBoard className='unclickable' />}
            <div className='shape' id='player' style={player.shapeStyle(canDrag, relX, relY)}></div>
            <div className='shape' id='target' style={target.shapeStyle(false)}></div>
        </div>
    );
};

export default Game;