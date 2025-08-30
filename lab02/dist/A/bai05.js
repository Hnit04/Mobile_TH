"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateTask = simulateTask;
function simulateTask(time, a) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Task done " + a);
        }, time);
    });
}
