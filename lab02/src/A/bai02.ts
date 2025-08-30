function getNumber(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1000);
        }, 1000);
    });
}

getNumber().then((num) => {
    console.log("Kết quả:", num); 
});
