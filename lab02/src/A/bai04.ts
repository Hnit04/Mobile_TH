function getRandomNumber(): Promise<number> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const num = Math.random();
            if (num > 0.1) {
                resolve(num);
            } else {
                reject(new Error("Failed to generate random number"));
            }
        }, 1000); 
    });
}

getRandomNumber()
    .then((value) => {
        console.log("Random number:", value);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    });
