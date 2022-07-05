class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add() {
    return this.x + this.y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
  }

  add() {
    return this.color + super.add();
  }
}

const p = new ColorPoint(1, 2, 'red');
console.log(p.add());
