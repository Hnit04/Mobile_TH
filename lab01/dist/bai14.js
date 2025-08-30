"use strict";
class Employee {
    constructor(name) {
        this.name = name;
    }
}
class Manager extends Employee {
    manage() {
        return "Quan ly team";
    }
}
class Developer extends Employee {
    develop() {
        return "Viet codecode";
    }
}
const manager = new Manager("Tinh");
console.log(`${manager.name} is ${manager.manage()}`);
const developer = new Developer("Hnit");
console.log(`${developer.name} is ${developer.develop()}`);
