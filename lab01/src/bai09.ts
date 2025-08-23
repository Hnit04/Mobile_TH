interface   Animal {
    name: string;
    sound(): string;
}
class Dog implements Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sound(): string {
        return "Woof!";
    }
}

const myDog = new Dog("Dom");
console.log(`${myDog.name} keu ${myDog.sound()}`);