import { Team } from './team';
import { Bettor } from './bettor';
import { UserDatabase } from '../database/user_data';
const userDatabase = new UserDatabase();

export class Game {

    id;
    team1;
    team2;
    event;
    total;
    canBet;
    bettors: Bettor[];

    /**
     * 
     * @param {number} id 
     * @param {Team} team1 
     * @param {Team} team2 
     * @param {string} event 
     */
    constructor(id: number, team1: Team, team2: Team, event: string) {
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

    getBettorByKey(key: number) {
        return this.bettors.find((bettor) => {
            return bettor.getKey() === key;
        });
    }

    bet(bettor: Bettor, amount: number, team: string) {
        if (!this.canBet) return new Promise<boolean>((resolve, reject) => resolve(false));
        if (!this.bettorExists(bettor)) this.bettors.push(bettor);
        if (this.team1.bettorExists(bettor) || this.team2.bettorExists(bettor)) return new Promise<boolean>((resolve, reject) => resolve(false));
        return new Promise<boolean>(async (resolve, reject) => {
            let balance = await userDatabase.getBalance(bettor.getKey(), bettor.getName()); 
            this.total += amount;
            if (balance < amount) resolve(false);  
            if (team === this.team1.getName()) {
                this.team1.addBettor(bettor, amount);
                userDatabase.updateBalance(bettor.getKey(), balance - amount);
                resolve(true);
            } else if (team === this.team2.getName()) {
                this.team2.addBettor(bettor, amount);
                userDatabase.updateBalance(bettor.getKey(), balance - amount);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    cancelBet(bettor: Bettor) {
        if (!this.canBet) return;
        if (!this.bettorExists(bettor)) return;
        console.log(bettor);
        return new Promise<boolean>(async (resolve, reject) => {
            let balance = await userDatabase.getBalance(bettor.getKey(), bettor.getName());
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
        });
    }

    betscore(bettor: Bettor, score: number[]) {
        if (!this.canBet) return false;
        if (!this.bettorExists(bettor)) this.bettors.push(bettor);
        let user = this.getBettorByKey(bettor.getKey());
        if (user === undefined) return false;
        user.setPredictScore(score);
        return true;
    }

    cancelBetScore(bettor: Bettor) {
        if (!this.canBet) return false;
        if (!this.bettorExists(bettor)) return false;
        let user = this.getBettorByKey(bettor.getKey());
        if (user === undefined) return false;
        user.setPredictScore([0, 0]);
        return true;
    }

    selectRate() {
        let rate1 = Math.floor((this.team1.getBetAmount()/this.total)*1000)/10;
        let rate2 = 100 - rate1;
        return {
            team1: rate1,
            team2: rate2
        }
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
        }
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    getTeamByName(name: string) {
        if (this.team1.getName() === name) {
            return this.team1;
        } else if (this.team2.getName() === name) {
            return this.team2;
        } else {
            return null;
        }
    }

    async endGame(winner: string, score: number[]) {
        let winTeam = this.getTeamByName(winner);
        let loseTeam = this.getTeamByName(winner === this.team1.getName() ? this.team2.getName() : this.team1.getName());
        if (winTeam === null || loseTeam === null) return;
        let bettors = winTeam.getBettors();
        let loserAmount = loseTeam.getBetAmount(); // c
        for (let i = 0; i < bettors.length; i++) {
            let bettor = bettors[i];
            let balance = await userDatabase.getBalance(bettor.getKey(), bettor.getName());
            let winnerAmount = winTeam.getBettorBetAmount(bettor);
            let correctAmount = this.correctAmount(winner, score); // a
            let incorrectAmount = this.incorrectAmount(winner, score); // b
            let gameBettor = this.findBettor(bettor);
            if (gameBettor === undefined) continue;
            if (this.event === "soccer") {
                if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                    let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(winnerAmount, loserAmount, correctAmount, incorrectAmount, amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                } else {
                    let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(winnerAmount, loserAmount, correctAmount, incorrectAmount, amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                }
            } else if (this.event === "basketball") {
                if (gameBettor.getPredictScore()[0] - 3 <= score[0] && score[0] <= gameBettor.getPredictScore()[0] + 3 &&
                    gameBettor.getPredictScore()[1] - 3 <= score[1] && score[1] <= gameBettor.getPredictScore()[1] + 3) {
                    let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                } else {
                    let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                }
            } else {
                if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                    let amount = Math.floor(winnerAmount + winnerAmount * (2 * loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                } else {
                    let amount = Math.floor(winnerAmount + winnerAmount * (loserAmount / (2 * correctAmount + incorrectAmount)));
                    console.log(amount);
                    userDatabase.updateBalance(bettor.getKey(), balance + amount);
                }
            }
        }
    }

    correctAmount(winner: string, score: number[]): number {
        let total = 0;
        let winTeam = this.getTeamByName(winner);
        if (winTeam === null) return 0;
        for (let i = 0; i < winTeam.getBettors().length; i++) {
            let bettor = winTeam.getBettors()[i];
            let gameBettor = this.findBettor(bettor);
            if (gameBettor === undefined) continue;
            if (this.event === "basketball") {
                if (gameBettor.getPredictScore()[0] - 3 <= score[0] && score[0] <= gameBettor.getPredictScore()[0] + 3 &&
                    gameBettor.getPredictScore()[1] - 3 <= score[1] && score[1] <= gameBettor.getPredictScore()[1] + 3) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            } else {
                if (gameBettor.getPredictScore()[0] === score[0] && gameBettor.getPredictScore()[1] === score[1]) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            }
        }
        return total;
    }

    incorrectAmount(winner: string, score: number[]): number {
        let total = 0;
        let winTeam = this.getTeamByName(winner);
        if (winTeam === null) return 0;
        for (let i = 0; i < winTeam.getBettors().length; i++) {
            let bettor = winTeam.getBettors()[i];
            let gameBettor = this.findBettor(bettor);
            if (gameBettor === undefined) continue;
            if (this.event === "basketball") {
                if (gameBettor.getPredictScore()[0] - 3 > score[0] || score[0] > gameBettor.getPredictScore()[0] + 3 ||
                    gameBettor.getPredictScore()[1] - 3 > score[1] || score[1] > gameBettor.getPredictScore()[1] + 3) {
                    total += winTeam.getBettorBetAmount(bettor);
                }
            } else {
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

    bettorExists(bettor: Bettor) {
        let result = false;
        this.bettors.forEach((b) => {
            if (b.equals(bettor)) result = true;
        });
        return result;
    }

    findBettor(bettor: Bettor) {
        return this.bettors.find((b) => {
            return b.getKey() === bettor.getKey();
        });
    }
}