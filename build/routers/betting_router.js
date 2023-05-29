"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_checker_1 = require("../util/session_checker");
const bettingRouter = express_1.default.Router();
bettingRouter.get('/', (req, res) => {
    let session = new session_checker_1.SessionChecker();
    if (session.checkLogin(req)) {
        res.render(__dirname.replace('routers', '') + '/public/totolist.html');
    }
    else {
        res.redirect('/login');
    }
});
module.exports = bettingRouter;
