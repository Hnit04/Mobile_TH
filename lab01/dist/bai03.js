"use strict";
class Car {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    information() {
        return 'thong tin xe: ' + this.brand + ', model: ' + this.model + ', nam san xuat: ' + this.year;
    }
}
const c = new Car('Honda', 'Air Blade', 2025);
console.log(c.information());
