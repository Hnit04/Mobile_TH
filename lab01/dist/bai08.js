"use strict";
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
}
const pr = new Array();
pr.push(new Product('Iphone 14', 1000));
pr.push(new Product('Samsung S23', 25));
pr.push(new Product('Xiaomi 13', 2000));
console.log('Danh sach san pham:');
pr.forEach(product => {
    console.log(`Name: ${product.getName()}, Price: ${product.getPrice()}`);
});
const filteredProducts = pr.filter(product => product.getPrice() > 100);
console.log('San pham co gia > 100:');
filteredProducts.forEach(product => {
    console.log(`Name: ${product.getName()}, Price: ${product.getPrice()}`);
});
