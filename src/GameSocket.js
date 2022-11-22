class GameSocket {

    constructor(guestId, setGameData, setStartPos, setWinner, admin = false) {
        this.guestId = admin ? "admin" : guestId;
        this.setGameData = setGameData;
        this.setStartPos = setStartPos;
        this.setWinner = setWinner;
        this.answer = [];
        this.admin = null;
        this.winner = false
    };

    connect() {
        this.socket = new WebSocket("wss://api.circledrag.com/ws/");
        // this.socket = new WebSocket("ws://localhost:8765/");

        this.socket.onopen = this.onOpen;
        this.socket.onmessage = (event) => this.onMessage(event, this);
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
    };

    send(message) {
        this.socket.send(JSON.stringify(message));
    };

    getGamestate(gameId) {
        let message = {
            method: "get_gamestate",
            gameId: gameId
        };
        this.socket.send(JSON.stringify(message));
    };

    sendResetWaiting(gameId) {
        let message = {
            method: "reset_waiting",
            gameId: gameId
        }
        if (!this.winner) {
            this.socket.send(JSON.stringify(message))
        }
    }

    playerConnect(guestId, gameId) {
        let message = {
            method: "player_connect",
            gameId: gameId,
            guestId: guestId,
            data: {
                waiting: false,
                times: [],
                size: [100, 100],
                hasLost: false,
            }
        };
        this.socket.send(JSON.stringify(message));
    };

    sendClose(gameId) {
        let message = {
            method: "kill",
            guestId: this.guestId,
            gameId: gameId,
        };
        this.answer = [];
        this.socket.send(JSON.stringify(message));
    };

    onOpen() {
        console.log("connected!");
    };

    onMessage(event) {
        let data = JSON.parse(event.data);
        let method = data["method"]
        if (method === "gamestate") {
            this.setGameData(data);
        };
        if (method === "start") {
            this.setStartPos(data.data)
        }
        if (method === "allGames") {
            this.setGameData(data.data)
        }
        if (method == "winner") {
            this.setWinner(data.data)
            this.winner = true
        }
    };

    onError(event) {
        if (event.data === undefined) {
            return null;
        } else {
            let data = JSON.parse(event.data);
            this.error = data;
        };
    };

    onClose() {
        console.log("connection closed.");
    };

    getAllGames() {
        this.socket.send(JSON.stringify({ method: "get_all_games" }));
    };

}

export default GameSocket