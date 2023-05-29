"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketCancelBetScore = exports.socketBetScore = exports.socketCancelBet = exports.socketBet = void 0;
const betting_js_1 = require("./betting.js");
const bettor_js_1 = require("./bettor.js");
const socketBet = (data) => {
    let amount = parseInt(data.amount);
    let game = (0, betting_js_1.getGameById)(data.gameId);
    if (game === null || game === void 0 ? void 0 : game.bettorExists(new bettor_js_1.Bettor(data.key, data.name)))
        return new Promise((resolve, reject) => resolve(false));
    if (game === undefined)
        return new Promise((resolve, reject) => resolve(false));
    return game.bet(new bettor_js_1.Bettor(data.key, data.name), amount, data.team);
};
exports.socketBet = socketBet;
const socketCancelBet = (data) => {
    console.log(data);
    let game = (0, betting_js_1.getGameById)(Number(data.gameId));
    console.log(game);
    if (game === undefined)
        return new Promise((resolve, reject) => resolve(false));
    return game.cancelBet(new bettor_js_1.Bettor(data.key, data.name));
};
exports.socketCancelBet = socketCancelBet;
const socketBetScore = (data) => {
    let game = (0, betting_js_1.getGameById)(data.gameId);
    if (game === undefined)
        return false;
    return game.betscore(new bettor_js_1.Bettor(data.key, data.name), data.score);
};
exports.socketBetScore = socketBetScore;
const socketCancelBetScore = (data) => {
    let game = (0, betting_js_1.getGameById)(data.gameId);
    if (game === undefined)
        return false;
    return game.cancelBetScore(new bettor_js_1.Bettor(data.key, data.name));
};
exports.socketCancelBetScore = socketCancelBetScore;
