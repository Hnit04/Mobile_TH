"use strict";
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    information() {
        return 'Ten toi la ' + this.name + ', toi ' + this.age + ' tuoi';
    }
}
const p = new Person('Nguyen Van A', 20);
console.log(p.information());
