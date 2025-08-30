class  Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }    
}
class MyDog extends Animal {
    bark(): string {
        return "Woof!";
    }
}
class MyCat extends Animal {
    meow(): string {                
        return "Meow!";
    }
}
const dog = new MyDog("Dom");
console.log(`${dog.name} keu ${dog.bark()}`);
const cat = new MyCat("Miu");
console.log(`${cat.name} keu ${cat.meow()}`);