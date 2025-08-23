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
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    informationStudent() {
        return super.information() + ', diem cua toi la ' + this.grade;
    }
}
const p = new Student('Tran Cong Tinh', 21, 9.5);
console.log(p.informationStudent());
