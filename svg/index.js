const cnvs = document.querySelector("#canvas");

// let width = Number(cnvs.getAttribute("width").split("p")[0]);
// let height = Number(cnvs.getAttribute("height").split("p")[0]);
let width = 1500;
let height = 1500;
console.log(width, height);
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let randEvenInt = (min, max) => {
  let n = randInt(min, max);
  if (n % 2 === 0) return n;
  else if (n + 1 > max) return n - 1;
  else return n + 1;
};
let rectangles = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  rectangles = [];
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

var xPad = Math.floor(width * 0.1);
var yPad = Math.floor(height * 0.1);

var initialRect = new Rectangle(new Point(0, 0), new Point(width, height));
initialRect.split(xPad, yPad, 0, 4);

function redraw() {
  initialRect = new Rectangle(new Point(0, 0), new Point(width, height));
  initialRect.split(xPad, yPad, 0, 1);
}

//const colors = ["#dad2d8", "#143642", "#0f8b8d", "#ec9a29", "#a8201a"];
var colors = [
  // "#2f0d10",
  // "#520c37",
  // "#8b2a2f",
  // "#a85257",
  // "#b8199c",
  // "#cc44dc",
  // "#d285fb",
  // "#f4e8f1",
  // "#fa060b",
  // "#f9060c",
  // "#ea1314",
  // "#f2798e",
  // "#fc28d2",

  // "#f408fc",
  // "#ec04fc",

  // "#a011f5",
  // "#9f18fa",
  // "#8e29ea",
  // "#6004f8",
  // "#6041fa",
  // "#6c2e94",
  // "#040405",
  // "#080610",
  // "#140c42",
  // "#261b75",
  // "#0e0896",
  // "#0404b8",
  // "#0505fb",
  // "#0504fb",
  // "#0c05fa",
  // "#0658f3",
  // "#1364f5",
  // "#0971e1",
  // "#0598f8",
  // "#09c7e8",
  // "#0af4f8",
  // "#06f8fa",
  // "#05fbf9",
  // "#20d8a7",
  // "#1edb9b",
  // "#57d0ed",
  // "#5acbc1",
  // "#6cbfbc",
  // "#abd8ce",
  // "#5cdf5a",
  // "#98e54a",
  // "#9bf164",
  // "#a8ea73",
  // "#b2fc4c",

  // "#f9f30e",
  // "#fca05f",
  // "#ffffff",
  // "#05f409",
  // "#05f311",
  // "#0ba124",
  // "#08711e",
  // "#04580a",
  // "#042c0a",
  // "#000000",
  "#a2c0d1",
  "#DFF6FF",
];
const gradient = document.querySelector("#gradient");
const pattern = document.querySelector("#pattern");

function createGrad(frqnc, id, parent) {
  const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  grad.setAttribute("x1", "100%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("x2", "0%");
  grad.setAttribute("y2", "0%");
  grad.setAttribute("id", id);

  const color1 = colors[randInt(0, colors.length)];
  const color2 = colors[randInt(0, colors.length)];

  let offset = 0;
  let nStops = 100 / frqnc;
  for (let i = 0; i < frqnc + 1; i++) {
    if (i % 2 === 0) {
      let stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", `${offset}%`);
      stop1.setAttribute("style", `stop-color: ${color1}`);
      grad.appendChild(stop1);
    } else if (i % 2 > 0) {
      let stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", `${offset}%`);
      stop2.setAttribute("style", `stop-color:  ${color2}`);
      grad.appendChild(stop2);
    }

    offset += nStops;
  }
  let def = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  def.appendChild(grad);
  parent.appendChild(def);
}

//const mkns = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);

function createPattern(thisid, parent) {
  const id = thisid;
  let frqncs = [10, 20, 60, 100];
  createGrad(frqncs[randInt(0, frqncs.length - 1)], id, parent);
  const patternSchema = document.querySelector("pattern");
  const pattern = patternSchema.cloneNode("deep");
  pattern.id = id + "patt";
  pattern.childNodes[1].setAttribute("fill", `url(#${id})`);

  pattern.childNodes[3].setAttribute("fill", `url(#${id})`);
  return pattern;
}

function renderRect(parent, x, y, width, height) {
  const id = "patt" + height + y;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  const pattern = createPattern(id, svg);

  // rect.setAttribute("fill", colors[3]);
  rect.setAttribute("fill", `url(#${id + "patt"})`);

  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);

  svg.setAttribute("x", x);
  svg.setAttribute("y", y);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.appendChild(pattern);
  svg.appendChild(rect);

  parent.appendChild(svg);
}

rectangles.reverse().forEach((rect, index) => {
  renderRect(
    cnvs,
    rect.min.x,
    rect.min.y,
    rect.max.x - rect.min.x,
    rect.max.y - rect.min.y
  );
});

const refresh = document.querySelector("#refresh");
// refresh.addEventListener("click", () => {               VISUAL
//   cnvs.childNodes.forEach((child) => child.remove());
// });

refresh.addEventListener("click", () => {
  rectangles = [];
  console.log(rectangles.length);
  while (cnvs.firstChild) {
    cnvs.removeChild(cnvs.lastChild);
  }
  initialRect = new Rectangle(new Point(0, 0), new Point(width, height));
  initialRect.split(xPad, yPad, 0, randInt(2, 10));
  console.log(rectangles.length);
  rectangles.reverse().forEach((rect, index) => {
    renderRect(
      cnvs,
      rect.min.x,
      rect.min.y,
      rect.max.x - rect.min.x,
      rect.max.y - rect.min.y
    );
  });
});

function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
document.querySelector("#download").addEventListener("click", () => {
  saveSvg(cnvs, "endless-nameless.svg");
});
