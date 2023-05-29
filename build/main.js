"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const socket_io_1 = require("socket.io");
const socket_response_1 = require("./game/socket_response");
const betting_1 = require("./game/betting");
const game_1 = require("./game/game");
const team_1 = require("./game/team");
const user_data_1 = require("./database/user_data");
const app = (0, express_1.default)();
const server = require('http').createServer(app);
const io = new socket_io_1.Server(server);
const options = {
    host: "210.114.22.146",
    user: "root",
    password: "ishs123!",
    database: "test"
};
const userDatabase = new user_data_1.UserDatabase();
const sessionStore = require('express-mysql-session')(express_session_1.default);
const sessionMiddleware = (0, express_session_1.default)({
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
    store: new sessionStore(options),
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express_1.default.static(__dirname + '/public'));
app.use(express_1.default.json());
app.use(sessionMiddleware);
app.use('/betting', require('./routers/betting_router'));
app.use('/login', require('./routers/login_router'));
app.use('/signup', require('./routers/sign_up_router'));
app.use('/logout', require('./routers/logout_router'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/sports_toto.html');
});
app.post('/end', (req, res) => {
    let id = req.body.id;
    let result = req.body.result;
    let score = req.body.score;
    let game = (0, betting_1.getGameById)(id);
    if (game) {
        game.endGame(result, score);
        (0, betting_1.removeGame)(game);
        io.emit('end', { game: game.toJson() });
        res.status(200).send({ success: true });
    }
    else {
        res.status(400).send({ success: false });
    }
});
app.post('/create', (req, res) => {
    let id = req.body.id;
    let team1 = req.body.team1;
    let team2 = req.body.team2;
    let event = req.body.event;
    let game = new game_1.Game(id, new team_1.Team(team1), new team_1.Team(team2), event);
    (0, betting_1.addGame)(game);
    res.status(200).send({ success: true });
});
app.post('/stop', (req, res) => {
    let id = req.body.id;
    let game = (0, betting_1.getGameById)(id);
    if (game) {
        game.stopBet();
        io.emit('stop', { gameId: id });
        res.status(200).send({ success: true });
    }
    else {
        res.status(400).send({ success: false });
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("a user disconnected");
    });
    socket.on('bet', (data) => {
        let key = data.key;
        let name = data.name;
        (0, socket_response_1.socketBet)(data).then((result) => {
            userDatabase.getBalance(key, name).then((balance) => {
                socket.emit('money', { balance: balance });
            });
            socket.emit('bet', { success: result });
        }).catch((err) => {
            socket.emit('bet', { success: false });
        });
    });
    socket.on('cancelbet', (data) => {
        var _a;
        let key = data.key;
        let name = data.name;
        (_a = (0, socket_response_1.socketCancelBet)(data)) === null || _a === void 0 ? void 0 : _a.then((result) => {
            socket.emit('cancelbet', { success: result });
            userDatabase.getBalance(key, name).then((balance) => {
                socket.emit('money', { balance: balance });
            });
        }).catch((err) => {
            socket.emit('cancelbet', { success: false });
        });
    });
    socket.on('betscore', (data) => {
        let key = data.key;
        let name = data.name;
        let result = (0, socket_response_1.socketBetScore)(data);
        userDatabase.getBalance(key, name).then((balance) => {
            socket.emit('money', { balance: balance });
        });
        socket.emit('betscore', { success: result });
    });
    socket.on('cancelbetscore', (data) => {
        let key = data.key;
        let name = data.name;
        let result = (0, socket_response_1.socketCancelBetScore)(data);
        userDatabase.getBalance(key, name).then((balance) => {
            socket.emit('money', { balance: balance });
        });
        socket.emit('cancelbetscore', { success: result });
    });
    socket.on('money', (data) => {
        let key = data.key;
        let name = data.name;
        userDatabase.getBalance(key, name).then((balance) => {
            socket.emit('money', { balance: balance });
        });
    });
});
setInterval(() => {
    let gameData = (0, betting_1.getGames)().map((game) => game.toJson());
    io.emit('update', { games: gameData });
}, 1000);
server.listen(3000, () => {
    console.log('listening on *:3000');
});
