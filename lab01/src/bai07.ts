class User{
    private name: string;
    constructor(name: string){
        this.name= name;
    }
    getName(): string{
        return this.name;
    }
    setName(name: string): void{
        this.name= name;
    }
}
const u= new User('Cong Tinh');
console.log(u.getName());
u.setName('Tran Cong Tinh');
console.log(u.getName());