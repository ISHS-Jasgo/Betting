"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const query_checker_1 = require("../util/query_checker");
const user_data_1 = require("../database/user_data");
const signUpRouter = express_1.default.Router();
signUpRouter.get('/', (req, res) => {
    res.status(200).render(__dirname.replace('routers', '') + '/public/signup.html');
});
signUpRouter.post('/', (req, res) => {
    console.log(req.body);
    let key = req.body.key;
    let name = req.body.name;
    let password = req.body.password;
    let checker = new query_checker_1.QueryChecker();
    let userDatabase = new user_data_1.UserDatabase();
    console.log(name, key, password);
    if (checker.notNull(key, name, password)) {
        if (checker.hasInvalidString(name, password)) {
            res.status(400).send("Invalid characters in name or password");
        }
        else {
            userDatabase.signup(name, key, password);
            req.session.key = key;
            req.session.name = name;
            req.session.password = password;
            req.session.save(() => console.log("Session saved"));
            res.status(200).send({ success: true });
        }
    }
    else {
        res.status(400).send({ success: false });
    }
});
module.exports = signUpRouter;
