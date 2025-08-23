class Car{
    brand: string;
    model: string;
    year: number;
    constructor(brand: string, model: string, year: number){
        this.brand= brand;
        this.model= model;
        this.year= year;
    }
    information(){
        return 'thong tin xe: ' + this.brand + ', model: ' + this.model + ', nam san xuat: ' + this.year;
    }
}
const c= new Car('Honda', 'Air Blade', 2025);
console.log(c.information());