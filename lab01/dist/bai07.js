"use strict";
class User {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
const u = new User('Cong Tinh');
console.log(u.getName());
u.setName('Tran Cong Tinh');
console.log(u.getName());
