import express from 'express';
import { QueryChecker } from '../util/query_checker';
import { UserDatabase } from '../database/user_data';
const signUpRouter = express.Router();
const userDatabase = new UserDatabase();

signUpRouter.get('/', (req, res) => {
    res.status(200).render(__dirname.replace('routers', '') + '/public/signup.html');
});

signUpRouter.post('/', (req, res) => {
    console.log(req.body);
    let key = req.body.key;
    let name = req.body.name;
    let password = req.body.password;
    let checker = new QueryChecker();
    console.log(name, key, password)
    if (checker.notNull(key, name, password)) {
        if (checker.hasInvalidString(name, password)) {
            res.status(400).send("Invalid characters in name or password");
        }
        else {
            userDatabase.signup(name, key, password)
            req.session.key = key;
            req.session.name = name;
            req.session.password = password;
            req.session.save(() => console.log("Session saved"));
            res.status(200).send({success: true});
        }
    } else {
        res.status(400).send({success: false});
    }
});

module.exports = signUpRouter;