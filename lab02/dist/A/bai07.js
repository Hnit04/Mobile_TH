"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bai05_1 = require("./bai05");
function runRace() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Promise.race([
                (0, bai05_1.simulateTask)(1000, "a"),
                (0, bai05_1.simulateTask)(2000, "b"),
                (0, bai05_1.simulateTask)(500, "c")
            ]);
            console.log("Fastest result:", result);
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
}
runRace();
