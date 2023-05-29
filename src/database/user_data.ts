export class UserDatabase {
    db = require('mysql').createConnection({
        host: "210.114.22.146",
        user: "root",
        password: "ishs123!",
        database: "test"
    });
    constructor() {
        this.db.connect((err: any) => {
            if (err) {
                throw err;
            }
            console.log('Connected to database');
        });
    }

    signup(name: string, key: number, password: string) {
        let sql = "INSERT INTO betusers (name, \`key\`, password) VALUES ('" + name + "', '" + key + "', '" + password + "')";
        this.db.query(sql, (err: any, result: any) => {
            if (err) {
                console.log(err);
            }
            console.log("1 record inserted");
        });
    }

    login(name: string, password: string) {
        return new Promise<boolean>((resolve, reject) => {
            let sql = "SELECT * FROM betusers WHERE name = '" + name + "' AND password = '" + password + "'";
            this.db.query(sql, (err: any, result: any) => {
                if (err) {
                    console.log(err);
                }
                if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    getBalance(key: number, name: string) {
        return new Promise<number>((resolve, reject) => {
            let sql = "SELECT balance FROM betusers WHERE name = '" + name + "' AND \`key\` = '" + key + "'";
            this.db.query(sql, (err: any, result: any) => {
                if (err) {
                    throw err;
                }
                resolve(result[0].balance);
            });
        });
    }

    updateBalance(key: number, balance: number) {
        let sql = "UPDATE betusers SET balance = " + balance + " WHERE \`key\` = '" + key + "'";
        this.db.query(sql, (err: any, result: any) => {
            if (err) {
                throw err;
            }
            console.log(result.affectedRows + " record(s) updated");
        });
    }   

    getKey(name: string, password: string) {
        return new Promise<number>((resolve, reject) => {
            let sql = "SELECT \`key\` FROM betusers WHERE name = '" + name + "' AND password = '" + password + "'";
            this.db.query(sql, (err: any, result: any) => {
                if (err) {
                    throw err;
                }
                resolve(result[0].key);
            });
        });
    }
}

