"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crespRest = exports.respRest = void 0;
const STATUS_CODE = {
    200: 'OK',
    201: 'Created',
    403: 'Forbidden',
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error'
};
function respRest(status, content) {
    return {
        status: status,
        message: STATUS_CODE[status],
        content: content
    };
}
exports.respRest = respRest;
function crespRest(status) {
    return {
        status: status,
        message: STATUS_CODE[status],
    };
}
exports.crespRest = crespRest;
