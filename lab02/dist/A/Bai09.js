"use strict";
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const filterEvenNumbers = new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            const evens = arr.filter(num => num % 2 === 0);
            resolve(evens);
        }
        catch (error) {
            reject(error);
        }
    }, 1000);
});
filterEvenNumbers
    .then(result => console.log("Even numbers:", result))
    .catch(err => console.error("Error:", err));
