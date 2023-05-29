"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryChecker = void 0;
class QueryChecker {
    notNull(...params) {
        let result = true;
        params.forEach((element) => {
            if (element == null) {
                result = false;
            }
        });
        return result;
    }
    hasInvalidString(...params) {
        let injectionRegex = new RegExp(/#|-|\/|\\|\"|\'|;/g);
        let result = false;
        params.forEach((element) => {
            if (injectionRegex.test(element)) {
                result = true;
            }
        });
        return result;
    }
}
exports.QueryChecker = QueryChecker;
