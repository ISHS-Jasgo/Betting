import express from 'express';
import session from 'express-session';
import { Server } from 'socket.io';
import { socketBet, socketBetScore, socketCancelBet, socketCancelBetScore } from './game/socket_response';
import { getGames, getGameById, addGame, removeGame } from './game/betting';
import { Game } from './game/game';
import { Team } from './game/team';
import { UserDatabase } from './database/user_data';

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);
const options = {
    host: "210.114.22.146",
    user: "root",
    password: "ishs123!",
    database: "test"
};
const userDatabase = new UserDatabase();
const sessionStore = require('express-mysql-session')(session);
const sessionMiddleware = session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
    store: new sessionStore(options),
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
})

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(sessionMiddleware);

app.use('/betting', require('./routers/betting_router'));
app.use('/login', require('./routers/login_router'));
app.use('/signup', require('./routers/sign_up_router'));
app.use('/logout', require('./routers/logout_router'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/sports_toto.html');
});

app.post('/end', (req, res) => {
    let id = req.body.id;
    let result = req.body.result;
    let score = req.body.score;
    let game = getGameById(id);
    if (game) {
        game.endGame(result, score);
        removeGame(game);
        io.emit('end', { game: game.toJson() });
        res.status(200).send({success: true});
    } else {
        res.status(400).send({success: false});
    }
});

app.post('/create', (req, res) => {
    let id = req.body.id;
    let team1 = req.body.team1;
    let team2 = req.body.team2;
    let event = req.body.event;
    let game = new Game(id, new Team(team1), new Team(team2), event);
    addGame(game);
    res.status(200).send({success: true});
});

app.post('/stop', (req, res) => {
    let id = req.body.id;
    let game = getGameById(id);
    if (game) {
        game.stopBet();
        io.emit('stop', { gameId: id });
        res.status(200).send({success: true});
    } else {
        res.status(400).send({success: false});
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
        socketBet(data).then((result) => {
            userDatabase.getBalance(key, name).then((balance) => {
                socket.emit('money', { balance: balance });
            });
            socket.emit('bet', { success: result });
        }
        ).catch((err) => {
            socket.emit('bet', { success: false });
        });
    });
    socket.on('cancelbet', (data) => {
        let key = data.key;
        let name = data.name;
        socketCancelBet(data)?.then((result) => {
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
        let result = socketBetScore(data);
        userDatabase.getBalance(key, name).then((balance) => {
            socket.emit('money', { balance: balance });
        });
        socket.emit('betscore', { success: result });
    });
    socket.on('cancelbetscore', (data) => {
        let key = data.key;
        let name = data.name;
        let result = socketCancelBetScore(data);
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
    let gameData = getGames().map((game) => game.toJson());
    io.emit('update', { games: gameData });
}, 1000);

server.listen(3000, () => {
    console.log('listening on *:3000');
});