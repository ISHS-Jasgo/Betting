import { QueryChecker } from '../util/query_checker';
import { UserDatabase } from '../database/user_data';
import express from 'express';


const loginRouter = express.Router();
const userDatabase = new UserDatabase();

loginRouter.get('/', (req, res, next) => {
    res.status(200).render(__dirname.replace('routers', '') + '/public/login.html');
});

loginRouter.post('/', (req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;
    let checker = new QueryChecker();
    if (checker.notNull(name, password)) {
        if (checker.hasInvalidString(name, password)) {
            res.status(400).send("Invalid characters in name or password");
        } else {
            userDatabase.login(name, password).then((result) => {
                if (result) {
                    userDatabase.getKey(name, password).then((key) => {
                        req.session.key = key;
                        req.session.name = name;
                        req.session.password = password;
                        req.session.save(() => console.log("Session saved"));
                        res.status(200).send({
                            success: true,
                            key: key,
                            name: name,
                            password: password
                        });
                    });
                } else {
                    res.status(400).send({success: false});
                }
            }).catch((err) => {
                res.status(500).send({success: false});
            });
        }
    } else {
        res.status(400).send({success: false});
    }
});

module.exports = loginRouter;