class Employee {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class Manager extends Employee {
    manage(): string {
        return "Quan ly team";
    }
}
class Developer extends Employee {
    develop(): string {                
        return "Viet codecode";
    }
}           

const manager = new Manager("Tinh");
console.log(`${manager.name} is ${manager.manage()}`);  
const developer = new Developer("Hnit");
console.log(`${developer.name} is ${developer.develop()}`);