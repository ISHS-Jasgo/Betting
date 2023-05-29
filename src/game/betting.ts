import { Bettor } from './bettor.js';
import { Game } from './game.js';

/**
 * @type {Game[]}
 */
let games: Game[] = [];

const getGames = () => {
    return games;
}

/**
 * 
 * @param {Game} game 
 */
const addGame = (game: Game) => {
    games.push(game);
}

/**
 * 
 * @param {Game} game 
 */
const removeGame = (game: Game) => {
    games = games.filter((g) => {
        return g.getId() !== game.getId();
    });
}

const getGameById = (id: number) => {
    return games.find((game) => {
        return game.getId() === id;
    });
}


//export all functions
export {
    addGame,
    removeGame,
    getGameById,
    getGames
}

