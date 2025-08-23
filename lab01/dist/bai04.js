"use strict";
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
    perimeter() {
        return 2 * (this.width + this.height);
    }
}
const r = new Rectangle(20, 4);
console.log('Dien tich hinh chu nhat: ' + r.area());
console.log('Chu vi hinh chu nhat: ' + r.perimeter());
