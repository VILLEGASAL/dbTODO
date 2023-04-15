"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDate = void 0;
let getDate = () => {
    let today = new Date();
    let currentDay = today.getDay();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString('en-US', options);
    return day;
};
exports.getDate = getDate;
let getDay = () => {
    let today = new Date();
    let currentDay = today.getDay();
    let options = {
        weekday: "long",
    };
    let day = today.toLocaleDateString('en-US', options);
    return day;
};
