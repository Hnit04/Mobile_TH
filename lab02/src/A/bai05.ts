
export function simulateTask(time: number, a: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Task done "+a);
        }, time);
    });
}
