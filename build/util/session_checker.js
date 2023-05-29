"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionChecker = void 0;
const query_checker_js_1 = require("./query_checker.js");
class SessionChecker {
    constructor() {
    }
    checkLogin(req) {
        let checker = new query_checker_js_1.QueryChecker();
        if (checker.notNull(req.session.key, req.session.name, req.session.password)) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.SessionChecker = SessionChecker;
