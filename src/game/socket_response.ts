import { addGame, removeGame, getGameById } from './betting.js';
import { Bettor } from './bettor.js';

const socketBet = (data: any) => {
    let amount = parseInt(data.amount);
    let game = getGameById(data.gameId);
    if (game?.bettorExists(new Bettor(data.key, data.name))) return new Promise<boolean>((resolve, reject) => resolve(false));
    if (game === undefined) return new Promise<boolean>((resolve, reject) => resolve(false));
    return game.bet(new Bettor(data.key, data.name), amount, data.team);
}

const socketCancelBet = (data: any) => {
    console.log(data);
    let game = getGameById(Number(data.gameId));
    console.log(game);
    if (game === undefined) return new Promise<boolean>((resolve, reject) => resolve(false));
    return game.cancelBet(new Bettor(data.key, data.name));
}

const socketBetScore = (data: any) => {
    let game = getGameById(data.gameId);
    if (game === undefined) return false;
    return game.betscore(new Bettor(data.key, data.name), data.score);
}

const socketCancelBetScore = (data: any) => {
    let game = getGameById(data.gameId);
    if (game === undefined) return false;
    return game.cancelBetScore(new Bettor(data.key, data.name));
}

export {
    socketBet,
    socketCancelBet,
    socketBetScore,
    socketCancelBetScore
}