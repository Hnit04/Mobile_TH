"use strict";
class Account {
    constructor(owner, accountNo, openingBalance = 0) {
        this._balance = 0;
        this.owner = owner;
        this.accountNo = accountNo;
        this._balance = openingBalance;
    }
    get balance() {
        return this._balance;
    }
    deposit(amount) {
        this._balance += amount;
    }
}
const acc = new Account("Nam", "ACC-123", 1000);
console.log(acc.owner);
console.log(acc.balance);
acc.deposit(500);
console.log(acc.balance);
