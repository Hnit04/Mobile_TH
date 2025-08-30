abstract class Shape{
    abstract area(): number;
}
class Square extends Shape{
    sideLength: number;
    constructor(sideLength: number){
        super();
        this.sideLength= sideLength;
    }
    area(): number {
        return this.sideLength * this.sideLength;
    }
}
class Circle extends Shape{
    radius: number;
    constructor(radius: number){
        super();
        this.radius= radius;
    }
    area(): number {
        return Math.PI * this.radius * this.radius;
    }
}
const s= new Square(5);
console.log('Dien tich hinh vuong: ' + s.area());       
const circle= new Circle(3);
console.log('Dien tich hinh tron: ' +circle.area());