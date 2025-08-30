
export function simulateTask(time: number): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Task done");
        }, time);
    });
}


simulateTask(3000).then((msg) => {
    console.log(msg); 
});
