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
class Student extends Person{
    grade: number;
    constructor(name: string, age: number, grade: number){
        super(name, age);
        this.grade= grade;
    }

    informationStudent(){
        return super.information() + ', diem cua toi la ' + this.grade;
    }
}
const p= new Student('Tran Cong Tinh', 21,9);
console.log(p.informationStudent());