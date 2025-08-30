"use strict";
class Animal {
    constructor(name) {
        this.name = name;
    }
}
class MyDog extends Animal {
    bark() {
        return "Woof!";
    }
}
class MyCat extends Animal {
    meow() {
        return "Meow!";
    }
}
const dog = new MyDog("Dom");
console.log(`${dog.name} keu ${dog.bark()}`);
const cat = new MyCat("Miu");
console.log(`${cat.name} keu ${cat.meow()}`);
