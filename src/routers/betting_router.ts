import express from 'express';
import { SessionChecker } from '../util/session_checker';
const bettingRouter = express.Router();

bettingRouter.get('/', (req, res) => {
    let session = new SessionChecker();
    if (session.checkLogin(req)) {
        res.render(__dirname.replace('routers', '') + '/public/totolist.html');
    } else {
        res.redirect('/login');
    }
});

module.exports = bettingRouter;