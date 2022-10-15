let colors = [
  "#f2545b",
  "#a93f55",
  " #19323c",
  "#f3f7f0",
  " #8c5e58",
  "#2e86ab",
  " #f6f5ae",
  "#f5f749",
  " #f24236",
  "#d00000",
  "#ffba08",
  " #3f88c5",
  "#032b43",
  " #136f63",
];
let gradient = document.querySelector(".grad");

function createGrad() {
  let newGrad = gradient.cloneNode(true);
  let grad = makeGrad();
  newGrad.childNodes[1].style.background = grad;
  newGrad.childNodes[3].style.background = grad;

  return newGrad;
}

function random(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeGrad() {
  let color = random(colors);
  let colour = random(colors);
  while (color === colour) {
    colour = random(colors);
  }
  let start = "linear-gradient( 90deg,";
  let end = ")";

  let gradString = "";
  let frqnc = random([9, 13]);
  for (let i = 0; i < frqnc; i++) {
    if (i % 2 === 0) gradString = gradString.concat(color + ",");
    else gradString = gradString.concat(colour + ",");
  }
  return start.concat(gradString.slice(0, gradString.length - 1)) + ")";
}

function save() {
  var markup = document.documentElement.innerHTML;
  var htmlContent = [markup];
  var bl = new Blob(htmlContent, { type: "text/html" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(bl);
  a.download = "your-download-name-here.html";
  a.hidden = true;
  document.body.appendChild(a);
  a.innerHTML = "000";
  a.click();
}

document.querySelector("#download").addEventListener("click", () => {
  save();
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let rectangles = [];
let width = 10000;
let height = 10000;
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get height() {
    return this.max.y - this.min.y;
  }

  split(xPad, yPad, depth, limit) {
    // Check the level of recursion
    if (depth === limit) {
      return;
    }

    // Check the rectangle is enough large and tall
    if (this.width < 2 * xPad || this.height < 2 * yPad) {
      return;
    }

    // If the rectangle is wider than it's height do a left/right split
    var r1 = new Rectangle();
    var r2 = new Rectangle();
    if (this.width > this.height) {
      var x = randInt(this.min.x + xPad, this.max.x - xPad);
      r1 = new Rectangle(this.min, new Point(x, this.max.y));
      r2 = new Rectangle(new Point(x, this.min.y), this.max);
      // Else do a top/bottom split
    } else {
      var y = randInt(this.min.y + yPad, this.max.y - yPad);
      r1 = new Rectangle(this.min, new Point(this.max.x, y));
      r2 = new Rectangle(new Point(this.min.x, y), this.max);
    }

    // Split the sub-rectangles
    r1.split(xPad, yPad, depth + 1, limit);
    r2.split(xPad, yPad, depth + 1, limit);
    rectangles.push(r1, r2);
  }
}

var xPad = Math.floor(width * 0.1 - 10);
var yPad = Math.floor(height * 0.1 - 10);

var initialRect = new Rectangle(new Point(0, 0), new Point(width, height));
initialRect.split(xPad, yPad, 0, 8);

rectangles.reverse().forEach((item, index) => {
  if (index === 0) {
    let div = createGrad();
    div.style.position = "absolute";
    div.style.left = "0%";
    div.style.bottom = "0%";
    div.style.width = "100%";
    div.style.height = "100%";
    document.body.appendChild(div);
  }
  let x = item.min.x;
  let y = item.min.y;
  let width = item.max.x - item.min.x;
  let height = item.max.y - item.min.y;

  let div = createGrad();
  div.style.position = "absolute";
  let precent = (value) =>
    value.toString().slice(0, 2) + "." + value.toString().slice(2, 4) + "%";

  div.style.left = precent(x);
  div.style.bottom = precent(y);
  div.style.width = precent(width);
  div.style.height = precent(height);
  //   div.style.border = "1px solid white";
  document.body.appendChild(div);
});
gradient.remove();
console.log(rectangles);
