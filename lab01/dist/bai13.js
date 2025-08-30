"use strict";
class Shape {
}
class Square extends Shape {
    constructor(sideLength) {
        super();
        this.sideLength = sideLength;
    }
    area() {
        return this.sideLength * this.sideLength;
    }
}
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius * this.radius;
    }
}
const s = new Square(5);
console.log('Dien tich hinh vuong: ' + s.area());
const circle = new Circle(3);
console.log('Dien tich hinh tron: ' + circle.area());
