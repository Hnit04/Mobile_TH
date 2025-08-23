"use strict";
class Dog {
    constructor(name) {
        this.name = name;
    }
    sound() {
        return "Woof!";
    }
}
const myDog = new Dog("Dom");
console.log(`${myDog.name} keu ${myDog.sound()}`);
