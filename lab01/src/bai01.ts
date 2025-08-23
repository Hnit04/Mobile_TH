class Person{
    name: string;
    age: number;
    constructor(name: string, age: number){
        this.name= name;
        this.age= age;
    }

    information(){
        return 'Ten toi la ' + this.name + ', toi ' + this.age + ' tuoi';
    }
  
}
  const p= new Person('Tran Cong Tinh', 21);
    console.log(p.information());