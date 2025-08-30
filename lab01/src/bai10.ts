class Account {
    public owner: string;
    private _balance: number = 0;
    readonly accountNo: string;
  
    constructor(owner: string, accountNo: string, openingBalance = 0) {
      this.owner = owner;
      this.accountNo = accountNo;    
      this._balance = openingBalance; 
    }

    get balance(): number {
      return this._balance;
    }
  
    deposit(amount: number): void {
      this._balance += amount;
    }
  }
const acc = new Account("Nam", "ACC-123", 1000);

console.log(acc.owner);       
console.log(acc.balance);    
  
acc.deposit(500);
console.log(acc.balance);    

    