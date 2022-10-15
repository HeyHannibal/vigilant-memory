var colors = [
  "#2f0d10",
  "#520c37",
  "#8b2a2f",
  "#a85257",
  "#b8199c",
  "#cc44dc",
  "#d285fb",
  "#f4e8f1",
  "#fa060b",
  "#f9060c",
  "#ea1314",
  "#f2798e",
  "#f717cb",
  "#fc28d2",
  "#f725e2",
  "#f424e4",
  "#f408fc",
  "#ec04fc",
  "#ec04f5",
  "#ec04ee",
  "#e004e1",
  "#a011f5",
  "#9f18fa",
  "#8e29ea",
  "#6004f8",
  "#6041fa",
  "#6c2e94",
  "#040405",
  "#080610",
  "#140c42",
  "#261b75",
  "#0e0896",
  "#0404b8",
  "#0505fb",
  "#0504fb",
  "#0c05fa",
  "#0658f3",
  "#1364f5",
  "#0971e1",
  "#0598f8",
  "#09c7e8",
  "#0af4f8",
  "#06f8fa",
  "#05fbf9",
  "#20d8a7",
  "#1edb9b",
  "#57d0ed",
  "#5acbc1",
  "#6cbfbc",
  "#abd8ce",
  "#5cdf5a",
  "#98e54a",
  "#9bf164",
  "#a8ea73",
  "#b2fc4c",
  "#fafa07",
  "#f9f30d",
  "#f9f30e",
  "#fca05f",
  "#ffffff",
  "#05f409",
  "#05f311",
  "#0ba124",
  "#08711e",
  "#04580a",
  "#042c0a",
  "#000000",
];

// const colors = ["#ff9d9d", "#ffeaaa", "#ababe0", "#98dcec", "#7ca8a5"];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 0;
let loop;
let stoploop = false;
const angleStep = 0; // angle (spin/vertigo)

let a = document.querySelector("#start");
a.addEventListener("click", () => {
  console.log("aa");
  recordCanvas(canvas, 1000);
});

// control the frequency of the gradient repeat
let frequency = 100;

// speed of the animation
let linearStep = 0.001;
document.querySelector("#speed").addEventListener("change", (e) => {
  linearStep = Number(e.target.value);
});

let randOddInt = (min, max) => {
  let n = randInt(min, max);
  if (n % 2 === 0) return n + 1 > max ? n - 1 : n + 1;
  else return n;
};

let randEvenInt = (min, max) => {
  let n = randInt(min, max);
  if (n % 2 === 0) return n;
  else if (n + 1 > max) return n - 1;
  else return n + 1;
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//// main
function init(posX, posY, w, h) {
  let max = colors.length - 1;
  let color1 = colors[randInt(0, max)];
  let color2 = colors[randInt(0, max)];

  let frqnc = randEvenInt(2, frequency); ///IMPORTANT

  let gradientArr = [];

  gradientArr.push({ color: color1, pos: 0 });

  for (let i = 1; i < frqnc; i++) {
    if (i % 2 > 0) gradientArr.push({ color: color2, pos: i / frqnc });
    if (i % 2 === 0) gradientArr.push({ color: color1, pos: i / frqnc });
  }
  gradientArr.push({ color: color1, pos: 1 });

  const mw = canvas.width;
  const mh = canvas.height;
  let angles = [90, 180, 270];
  let angle = angles[randInt(0, 2)]; //too much change, for copy do less
  function drawScreen() {
    angle = (angle + angleStep) % 360;
    const [x1, y1, x2, y2] = angleToPoints(angle, mw, mh);
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    for (const colorStop of gradientArr) {
      gradient.addColorStop(colorStop.pos, colorStop.color);
      colorStop.pos += linearStep;
      // ### corrected error here
      if (colorStop.pos > 1) colorStop.pos -= 1;
    }
    // ### compute and set the gradient end stops
    const sortedStops = gradientArr.sort((a, b) => a.pos - b.pos);
    const firstStop = sortedStops[0];
    const lastStop = sortedStops.slice(-1)[0];
    const endColor = lerpColor(firstStop.color, lastStop.color, firstStop.pos * frqnc); // was six
    gradient.addColorStop(0, endColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  }
  return { drawScreen };
}
function angleToPoints(angle, width, height) {
  const rad = ((180 - angle) / 180) * Math.PI;
  // This computes the length such that the start/stop points will be at the corners
  const length = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
  // Compute the actual x,y points based on the angle, length of the gradient line and the center of the div
  const halfx = (Math.sin(rad) * length) / 2.0;
  const halfy = (Math.cos(rad) * length) / 2.0;
  const cx = width / 2.0;
  const cy = height / 2.0;
  const x1 = cx - halfx;
  const y1 = cy - halfy;
  const x2 = cx + halfx;
  const y2 = cy + halfy;
  return [x1, y1, x2, y2];
}
function lerpColor(a, b, amount) {
  const ah = +a.replace("#", "0x"),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = +b.replace("#", "0x"),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);
  return "#" + ((0x1000000 + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const rectangles = [];

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

  split(xPad, yPad, depth, limit, ctx) {
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
    r1.split(xPad, yPad, depth + 1, limit, ctx);
    r2.split(xPad, yPad, depth + 1, limit, ctx);
    rectangles.push(r1, r2);
  }
}

var xPad = Math.floor(canvas.width * 0.1);
var yPad = Math.floor(canvas.height * 0.1);

var initialRect = new Rectangle(new Point(0, 0), new Point(canvas.width, canvas.height));
initialRect.split(xPad, yPad, 0, 14, ctx);

function redraw() {
  initialRect = new Rectangle(new Point(0, 0), new Point(canvas.width, canvas.height));
  initialRect.split(xPad, yPad, 0, 1, ctx);
}

async function makeit() {
  rectangles.reverse().forEach((item, index) => {
    let myFill = init();

    function drawGrad() {
      if (stoploop) return;
      ctx.strokeStyle = "transparent";
      ctx.rect(item.min.x, item.min.y, item.max.x - item.min.x, item.max.y - item.min.y);
      //console.log(myFill.drawScreen());
      ctx.fillStyle = myFill.drawScreen();
      ctx.fillRect(
        item.min.x,
        item.min.y,
        item.max.x - item.min.x,
        item.max.y - item.min.y
      );
      ctx.stroke();
    }

    function animation() {
      if (stoploop) return;
      drawGrad();
      loop = requestAnimationFrame(animation);
    }
    if (!stoploop) animation();
  });
}

makeit();

async function redo(e) {
  stoploop = true;
  cancelAnimationFrame(loop);
  ctx.clearRect(0, 0, 800, 800);
  frequency = randInt(2, Number(e.target.value));

  setTimeout(() => {
    stoploop = false;
    cancelAnimationFrame(loop);

    makeit();
  }, 300);
}
document.querySelector("#frequency").addEventListener("change", async (e) => {
  redo(e);
});

setInterval(() => {
  console.log(window.performance.memory);
}, 1500);

function CanvasRecorder(canvas, video_bits_per_sec) {
  this.start = startRecording;
  this.stop = stopRecording;
  this.save = download;

  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;

  var stream = canvas.captureStream();
  if (typeof stream == undefined || !stream) {
    return;
  }

  const video = document.createElement("video");
  video.style.display = "none";

  function startRecording() {
    let types = [
      "video/webm",
      "video/webm,codecs=vp9",
      "video/vp8",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "video/mpeg",
    ];

    for (let i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        supportedType = types[i];
        break;
      }
    }
    if (supportedType == null) {
      console.log("No supported type found for MediaRecorder");
    }
    let options = {
      mimeType: supportedType,
      videoBitsPerSecond: video_bits_per_sec || 2500000, // 2.5Mbps
    };

    recordedBlobs = [];
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      alert("MediaRecorder is not supported by this browser.");
      console.error("Exception while creating MediaRecorder:", e);
      return;
    }

    console.log("Created MediaRecorder", mediaRecorder, "with options", options);
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(100); // collect 100ms of data blobs
    console.log("MediaRecorder started", mediaRecorder);
  }

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  function handleStop(event) {
    console.log("Recorder stopped: ", event);
    const superBuffer = new Blob(recordedBlobs, { type: supportedType });
    video.src = window.URL.createObjectURL(superBuffer);
  }

  function stopRecording() {
    mediaRecorder.stop();
    console.log("Recorded Blobs: ", recordedBlobs);
    video.controls = true;
  }

  function download(file_name) {
    const name = file_name || "recording.webm";
    const blob = new Blob(recordedBlobs, { type: supportedType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

const recorder = new CanvasRecorder(canvas, 6500000);

document.querySelector("#start").addEventListener("click", () => {
  recorder.start();
});

document.querySelector("#stop").addEventListener("click", () => {
  recorder.stop();
  recorder.save();
});
