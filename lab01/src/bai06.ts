class Book{
    title: string;
    author: string;
    year: number;
    constructor(title: string, author: string, year: number){
        this.title= title;
        this.author= author;
        this.year= year;
    }
    getSummary(){
        return `${this.title} viet boi ${this.author} vao nam ${this.year}.`;
    }
}
const book1 = new Book('Dragon Ball', 'Akira Toriyama', 1984);
console.log(book1.getSummary());