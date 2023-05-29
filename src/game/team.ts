import { Bettor } from "./bettor";

export class Team {

    private name: string;
    private bettors: Bettor[];
    private betAmount: number;

    /**
     * 
     * @param {string} name 
     */
    constructor(name: string) {
        this.name = name;
        this.bettors = [];
        this.betAmount = 0;
    }

    /**
     * 
     * @param {Bettor} bettor 
     * @param {number} amount 
     */
    addBettor(bettor: Bettor, amount: number) {
        if (this.bettors.includes(bettor)) {
            let index = this.bettors.indexOf(bettor);
            this.bettors[index].setBetAmount(this.bettors[index].getBetAmount() + amount);
            this.betAmount += amount;
        } else {
            bettor.setBetAmount(amount);
            this.bettors.push(bettor);
            this.betAmount += amount;
        }
    }

    removeBettor(bettor: Bettor) {
        this.betAmount -= (this.findBettor(bettor)?.getBetAmount() || 0);
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

    getBettorBetAmount(bettor: Bettor) {
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
        }
    }
    bettorExists(bettor: Bettor) {
        this.bettors.forEach((b) => {
            if (b.equals(bettor)) return true;
        });
        return false;
    }

    findBettor(bettor: Bettor) {
        for (let i = 0; i < this.bettors.length; i++) {
            if (this.bettors[i].equals(bettor)) {
                return this.bettors[i];
            }
        }
        return undefined;
    }
}