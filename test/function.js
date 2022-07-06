Function.prototype.myBind = function (context) {
  const that = this;

  // 处理myBind方法传入参数，第一个参数是this，所以我们应该只获取后面的参数
  const args = Array.prototype.slice.call(arguments, 1);

  const cFun = function () {
    // 这里的arguments是当前匿名函数的参数
    const moreArgs = Array.prototype.slice.call(arguments); // 将arguments处理成普通数组
    const target = this instanceof cFun ? this : context; // 说明1
    return that.apply(target, args.concat(moreArgs)); // 实现绑定this
  };

  console.log('this', this);
  cFun.prototype = Object.create(this.prototype); // 说明2
  return cFun;
};

const value = 'window';
const foo = {
  value: 1,
};
function person(name, age) {
  this.habit = 'study';
  console.log(this);
  console.log(this.value);
  console.log(name);
  console.log(age);
}

person.prototype.friend = 'haha';

const bindP = person.myBind(foo, 'huhu');

const p = new bindP(18);

console.log(p.friend);
console.log(p.habit);
