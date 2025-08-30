function getError(): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Something went wrong"));
        }, 1000); 
    });
}

getError()
    .then((res) => {
        console.log("Kết quả:", res);
    })
    .catch((err) => {
        console.error("Lỗi:", err.message); 
    });
