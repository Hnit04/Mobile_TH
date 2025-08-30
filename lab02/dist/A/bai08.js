"use strict";
Promise.resolve(2)
    .then(num => {
    const squared = num * num;
    console.log("Square:", squared);
    return squared;
})
    .then(num => {
    const doubled = num * 2;
    console.log("Double:", doubled);
    return doubled;
})
    .then(num => {
    const result = num + 5;
    console.log("Add 5:", result);
    return result;
})
    .then(finalResult => {
    console.log("Final Result:", finalResult);
})
    .catch(err => console.error("Error:", err));
