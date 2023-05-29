"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cf = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let jsn = fs_1.default.readFileSync(path_1.default.join(__dirname, 'config.json')).toString();
let cf = JSON.parse(jsn);
exports.cf = cf;
