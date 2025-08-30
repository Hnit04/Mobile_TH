
import { simulateTask } from "./bai05";

Promise.all([
    simulateTask(1000,"a"),
    simulateTask(2000,"b"),
    simulateTask(3000,"c")
]).then((results) => {
    console.log("All tasks finished:");
    console.log(results);
});
