import { Request } from 'express';
import { QueryChecker } from './query_checker.js';

export class SessionChecker {

    constructor() {
    }

    checkLogin(req: Request) {
        let checker = new QueryChecker();
        if (checker.notNull(req.session.key, req.session.name, req.session.password)) {
            return true;
        } else {
            return false;
        }
    }
}