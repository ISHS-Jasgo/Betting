"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = exports.getGameById = exports.removeGame = exports.addGame = void 0;
let games = [];
const getGames = () => {
    return games;
};
exports.getGames = getGames;
const addGame = (game) => {
    games.push(game);
};
exports.addGame = addGame;
const removeGame = (game) => {
    games = games.filter((g) => {
        return g.getId() !== game.getId();
    });
};
exports.removeGame = removeGame;
const getGameById = (id) => {
    return games.find((game) => {
        return game.getId() === id;
    });
};
exports.getGameById = getGameById;
