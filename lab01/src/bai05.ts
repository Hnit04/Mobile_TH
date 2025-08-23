import * as readlineSync from 'readline-sync';
class BankAccount{
    balance: number;
    constructor(balance: number){
        this.balance= balance;
    }
    depost(tienGui: number){
        this.balance += tienGui;
    }
    withdraw(tienRut: number){
        if(tienRut > this.balance){
            console.log('So du khong du de rut');
        } else {
            this.balance -= tienRut;
        }
    }
    getBalance(){
        return this.balance;
    }
}
const b= new BankAccount(5000);
const tienGui = readlineSync.question("Nhap so tien can gui: ");
b.depost(Number(tienGui));
console.log('So du hien tai: ' + b.getBalance());
const tienRut = readlineSync.question("Nhap so tien can rut: ");
b.withdraw(Number(tienRut));
console.log('So du hien tai: ' + b.getBalance());
