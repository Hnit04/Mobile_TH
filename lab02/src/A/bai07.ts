import { simulateTask } from "./bai05";

async function runRace() {
    try {
        const result = await Promise.race([
            simulateTask(1000,"a"),
            simulateTask(2000,"b"),
            simulateTask(500,"c")
        ]);
        console.log("Fastest result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

runRace();
