"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bettor = void 0;
class Bettor {
    constructor(key, name) {
        this.key = key;
        this.name = name;
        this.betAmount = 0;
        this.predictScore = [0, 0];
    }
    getName() {
        return this.name;
    }
    getKey() {
        return this.key;
    }
    getBetAmount() {
        return this.betAmount;
    }
    getPredictScore() {
        return this.predictScore;
    }
    setPredictScore(score) {
        this.predictScore = score;
    }
    setBetAmount(amount) {
        this.betAmount = amount;
    }
    equals(bettor) {
        return this.key === bettor.getKey() && this.name === bettor.getName();
    }
    toJson() {
        return {
            key: this.key,
            name: this.name,
            betAmount: this.betAmount,
            predictScore: this.predictScore,
        };
    }
}
exports.Bettor = Bettor;
