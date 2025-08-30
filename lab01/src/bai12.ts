interface Flyable{
    fly(): void;
}
interface Swimmable{
    swim(): void;       
}
class Bird implements Flyable{
    fly(): void {
        console.log("Bay tren troi");
    }    
}
class Fish implements Swimmable{
    swim(): void {
        console.log("Boi duoiduoi nuoc");
    }    
}   

const bird= new Bird();
bird.fly();             
const fish= new Fish();
fish.swim();