import "./styles/Game.css";
import { useGuessState } from "./GuessContext";

const ScoreBoard = (props) => {
    let { gameData, } = useGuessState();
    let { className } = props
    let times = () => {
        let data = gameData["data"]
        let sorted = Object.fromEntries(Object.entries(data).sort(([, a], [, b]) => b["score"] - a["score"]))

        let i = 0
        return Object.keys(sorted).map(el => {
            let times = data[el]["times"]
            let height = data[el]["size"][0]
            let width = data[el]["size"][1]
            let score = data[el]["score"]
            let size = height * width
            if (data[el]["waiting"]) {
                i++
                return (
                    <tr>
                        <td>{i}</td>
                        <td>{el}</td>
                        <td>{score}</td>
                        <td>{Number(times.reduce((a, b) => a + b, 0)).toFixed(4)}</td>
                        <td>{size / 100}%</td>
                        <td><div className='shape' style={{ height: height, width: width, backgroundColor: "black" }}></div></td>
                    </tr>
                )
            }
        })
    }
    return (
        <div className={className} id={className}>
            <div className='times-container'>
                <table className='times'>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Total Time</th>
                            <th>Shape Percent</th>
                            <th className='centered'>Shape</th>
                        </tr>
                    </thead>
                    <tbody>
                        {times()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ScoreBoard;