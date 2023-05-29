"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const user_data_1 = require("../database/user_data");
const userDatabase = new user_data_1.UserDatabase();
class Game {
    constructor(id, team1, team2, event) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.event = event;
        this.total = 0;
        this.canBet = true;
        this.bettors = [];
    }
    getId() {
        return this.id;
    }
    getTeam1() {
        return this.team1;
    }
    getTeam2() {
        return this.team2;
    }
    getEvent() {
        return this.event;
    }
    getBettors() {
        return this.bettors;
    }
    getBettorByKey(key) {
        return this.bettors.find((bettor) => {
            return bettor.getKey() === key;
        });
    }
    bet(bettor, amount, team) {
        if (!this.canBet)
            return new Promise((resolve, reject) => resolve(false));
        if (!this.bettorExists(bettor))
            this.bettors.push(bettor);
        if (this.team1.bettorExists(bettor) || this.team2.bettorExists(bettor))
            return new Promise((resolve, reject) => resolve(false));
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let balance = yield userDatabase.getBalance(bettor.getKey(), bettor.getName());
            this.total += amount;
            if (balance < amount)
                resolve(false);
            if (team === this.team1.getName()) {
                this.team1.addBettor(bettor, amount);
                userDatabase.updateBalance(bettor.getKey(), balance - amount);
                resolve(true);
            }
            else if (team === this.team2.getName()) {
                this.team2.addBettor(bettor, amount);
                userDatabase.updateBalance(bettor.getKey(), balance - amount);
                resolve(true);
            }
            else {
                resolve(false);
            }
        }));
    }
    cancelBet(bettor) {
        if (!this.canBet)
            return;
        if (!this.bettorExists(bettor))
            return;
        console.log(bettor);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let balance = yield userDatabase.getBalance(bettor.getKey(), bettor.getName());
            let amount = this.team1.getBettorBetAmount(bettor) + this.team2.getBettorBetAmount(bettor);
            console.log(amount);
            userDatabase.updateBalance(bettor.getKey(), balance + amount);
            this.team1.removeBettor(bettor);
            this.team2.removeBettor(bettor);
            this.bettors = this.bettors.filter((b) => {
                return b.getKey() !== bettor.getKey();
            });
            this.total -= amount;
            resolve(true);
        }));
    }
    betscore(bettor, score) {
        if (!this.canBet)
            return false;
        if (!this.bettorExists(bettor))
            this.bettors.push(bettor);
        let user = this.getBettorByKey(bettor.getKey());
        if (user === undefined)
            return false;
        user.setPredictScore(score);
        return true;
    }
    cancelBetScore(bettor) {
        if (!this.canBet)
            return false;
        if (!this.bettorExists(bettor))
            return false;
        let user = this.getBettorByKey(bettor.getKey());
        if (user === undefined)
            return false;
        user.setPredictScore([0, 0]);
        return true;
    }
    selectRate() {
        let rate1 = Math.floor((this.team1.getBetAmount() / this.total) * 1000) / 10;
        let rate2 = 100 - rate1;
        return {
            team1: rate1,
            team2: rate2
        };
    }
    toJson() {
        return {
            id: this.id,
            team1: this.team1.toJson(),
            team2: this.team2.toJson(),
            event: this.event,
            total: this.total,
            canBet: this.canBet,
            rate: this.selectRate(),
        };
    }
    getTeamByName(name) {
        if (this.team1.getName() === name) {
            return this.team1;
        }
        else if (this.team2.getName() === name) {
            return this.team2;
        }
        else {
            return null;
        }
    }
    endGame(winner, score) {
        return __awaiter(this, void 0, void 0, function* () {
            let winTeam = this.getTeamByName(winner);
            let loseTeam = this.getTeamByName(winner === this.team1.getName() ? this.team2.getName() : this.team1.getName());
            if (winTeam === null || loseTeam === null)
                return;
            let bettors = winTeam.getBettors();
            let loserAmount = loseTeam.getBetAmount();
            for (let i = 0; i < bettors.length; i++) {
                let bettor = bettors[i];
                let balance = yield userDatabase.getBalance(bettor.getKey(), bettor.getName());
                let winnerAmount = winTeam.getBettorBetAmount(bettor);
                let correctAmount = this.correctAmount(winner, score);
                let incorrectAmount = this.incorrectAmount(winner, score);
                let gameBettor = this.findBettor(bettor);
                if (gameBettor === undefined)
                    continue;
                if (this.event === "soccer") {
                    if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                        let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(winnerAmount, loserAmount, correctAmount, incorrectAmount, amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                    else {
                        let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(winnerAmount, loserAmount, correctAmount, incorrectAmount, amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                }
                else if (this.event === "basketball") {
                    if (gameBettor.getPredictScore()[0] - 3 <= score[0] && score[0] <= gameBettor.getPredictScore()[0] + 3 &&
                        gameBettor.getPredictScore()[1] - 3 <= score[1] && score[1] <= gameBettor.getPredictScore()[1] + 3) {
                        let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                    else {
                        let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                }
                else {
                    if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                        let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                    else {
                        let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                        console.log(amount);
                        userDatabase.updateBalance(bettor.getKey(), balance + amount);
                    }
                }
            }
        });
    }
    correctAmount(winner, score) {
        let total = 0;
        let winTeam = this.getTeamByName(winner);
        if (winTeam === null)
            return 0;
        for (let i = 0; i < winTeam.getBettors().length; i++) {
            let bettor = winTeam.getBettors()[i];
            let gameBettor = this.findBettor(bettor);
            if (gameBettor === undefined)
                continue;
            if (this.event === "basketball") {
                if (gameBettor.getPredictScore()[0] - 3 <= score[0] && score[0] <= gameBettor.getPredictScore()[0] + 3 &&
                    gameBettor.getPredictScore()[1] - 3 <= score[1] && score[1] <= gameBettor.getPredictScore()[1] + 3) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            }
            else {
                if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            }
        }
        return total;
    }
    incorrectAmount(winner, score) {
        let total = 0;
        let winTeam = this.getTeamByName(winner);
        if (winTeam === null)
            return 0;
        for (let i = 0; i < winTeam.getBettors().length; i++) {
            let bettor = winTeam.getBettors()[i];
            let gameBettor = this.findBettor(bettor);
            if (gameBettor === undefined)
                continue;
            if (this.event === "basketball") {
                if (gameBettor.getPredictScore()[0] - 3 > score[0] || score[0] > gameBettor.getPredictScore()[0] + 3 ||
                    gameBettor.getPredictScore()[1] - 3 > score[1] || score[1] > gameBettor.getPredictScore()[1] + 3) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            }
            else {
                if (gameBettor.getPredictScore()[0] !== score[0] || gameBettor.getPredictScore()[1] !== score[1]) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            }
        }
        return total;
    }
    stopBet() {
        this.canBet = false;
    }
    bettorExists(bettor) {
        let result = false;
        this.bettors.forEach((b) => {
            if (b.equals(bettor))
                result = true;
        });
        return result;
    }
    findBettor(bettor) {
        return this.bettors.find((b) => {
            return b.getKey() === bettor.getKey();
        });
    }
}
exports.Game = Game;
