class Product{
    private name: string;
    private price: number;
    constructor(name: string, price: number){
        this.name= name;
        this.price= price;
    }
    getName(): string{
        return this.name;
    }
    getPrice(): number{
        return this.price;
    }
}
const pr= new Array<Product>();
pr.push(new Product('Iphone 14', 1000));
pr.push(new Product('Samsung S23', 25));
pr.push(new Product('Xiaomi 13', 2000));
console.log('Danh sach san pham:');
pr.forEach(product => {
    console.log(`Name: ${product.getName()}, Price: ${product.getPrice()}`);
});

const filteredProducts = pr.filter(product => product.getPrice() > 100);
console.log('San pham co gia > 100:');
filteredProducts.forEach(product => {
    console.log(`Name: ${product.getName()}, Price: ${product.getPrice()}`);
});