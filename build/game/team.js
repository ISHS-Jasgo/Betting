"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    constructor(name) {
        this.name = name;
        this.bettors = [];
        this.betAmount = 0;
    }
    addBettor(bettor, amount) {
        if (this.bettors.includes(bettor)) {
            let index = this.bettors.indexOf(bettor);
            this.bettors[index].setBetAmount(this.bettors[index].getBetAmount() + amount);
            this.betAmount += amount;
        }
        else {
            bettor.setBetAmount(amount);
            this.bettors.push(bettor);
            this.betAmount += amount;
        }
    }
    removeBettor(bettor) {
        var _a;
        this.betAmount -= (((_a = this.findBettor(bettor)) === null || _a === void 0 ? void 0 : _a.getBetAmount()) || 0);
        this.bettors = this.bettors.filter((b) => {
            return b.getKey() !== bettor.getKey();
        });
    }
    getBettors() {
        return this.bettors;
    }
    getBetAmount() {
        return this.betAmount;
    }
    getName() {
        return this.name;
    }
    getBettorCount() {
        return this.bettors.length;
    }
    getBettorsJson() {
        let bettorsJson = [];
        for (let i = 0; i < this.bettors.length; i++) {
            bettorsJson.push(this.bettors[i].toJson());
        }
        return bettorsJson;
    }
    getBettorBetAmount(bettor) {
        for (let i = 0; i < this.bettors.length; i++) {
            if (this.bettors[i].equals(bettor)) {
                console.log(this.bettors[i].getBetAmount());
                return this.bettors[i].getBetAmount();
            }
        }
        return 0;
    }
    toJson() {
        return {
            name: this.name,
            bettors: this.getBettorsJson(),
            betAmount: this.betAmount
        };
    }
    bettorExists(bettor) {
        this.bettors.forEach((b) => {
            if (b.equals(bettor))
                return true;
        });
        return false;
    }
    findBettor(bettor) {
        for (let i = 0; i < this.bettors.length; i++) {
            if (this.bettors[i].equals(bettor)) {
                return this.bettors[i];
            }
        }
        return undefined;
    }
}
exports.Team = Team;
