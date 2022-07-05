// function Person() {
//   this.obj = { a: 1 }
// }

// Person.prototype.name = 'huhu'
// Person.prototype.age = 12

// const person1 = new Person()
// const person2 = new Person()

// person1.age = 15
// person1.obj.a = 4
// console.log('person2', person2.obj, person1.obj)

function SuperFun() {
  this.supName = 'super';
  this.list = [1];
}

SuperFun.prototype.getSupName = function () {
  return this.supName;
};

function SubFun() {
  this.subName = 'sub';
  this.obj = { a: 1 };
}

// 关键步骤：实现继承
SubFun.prototype = new SuperFun();

const instance = new SubFun();
instance.list.push(2);
instance.obj.a = 2;

const instance2 = new SubFun();
console.log(instance2.list, instance2.obj); // super
