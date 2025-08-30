"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bai05_1 = require("./bai05");
Promise.all([
    (0, bai05_1.simulateTask)(1000, "a"),
    (0, bai05_1.simulateTask)(2000, "b"),
    (0, bai05_1.simulateTask)(3000, "c")
]).then((results) => {
    console.log("All tasks finished:");
    console.log(results);
});
