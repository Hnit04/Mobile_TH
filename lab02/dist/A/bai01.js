"use strict";
function helloAsync() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello Async");
        }, 2000);
    });
}
helloAsync().then((message) => {
    console.log(message);
});
