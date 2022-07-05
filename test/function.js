function fun(a, b) {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2 }
  const arr = Array.prototype.slice.call(arguments);
  return arr;
}

console.log(fun(1, 2)); // [ 1, 2 ]
