"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabase = void 0;
class UserDatabase {
    constructor() {
        this.db = require('mysql').createConnection({
            host: "210.114.22.146",
            user: "root",
            password: "ishs123!",
            database: "test"
        });
        this.db.connect((err) => {
            if (err) {
                throw err;
            }
            console.log('Connected to database');
        });
    }
    signup(name, key, password) {
        let sql = "INSERT INTO betusers (name, \`key\`, password) VALUES ('" + name + "', '" + key + "', '" + password + "')";
        this.db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("1 record inserted");
        });
    }
    login(name, password) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM betusers WHERE name = '" + name + "' AND password = '" + password + "'";
            this.db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result.length > 0) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    getBalance(key, name) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT balance FROM betusers WHERE name = '" + name + "' AND \`key\` = '" + key + "'";
            this.db.query(sql, (err, result) => {
                if (err) {
                    throw err;
                }
                resolve(result[0].balance);
            });
        });
    }
    updateBalance(key, balance) {
        let sql = "UPDATE betusers SET balance = " + balance + " WHERE \`key\` = '" + key + "'";
        this.db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result.affectedRows + " record(s) updated");
        });
    }
    getKey(name, password) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT \`key\` FROM betusers WHERE name = '" + name + "' AND password = '" + password + "'";
            this.db.query(sql, (err, result) => {
                if (err) {
                    throw err;
                }
                resolve(result[0].key);
            });
        });
    }
}
exports.UserDatabase = UserDatabase;
