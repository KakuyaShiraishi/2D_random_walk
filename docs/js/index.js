let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let context = ctx;

let width = window.innerWidth;
let height = window.innerHeight;

let centerX = width * 0.5;
let mainColor = '#fff';
let globalAlpha = 0.5;
let offsetY = 50;
let minDistanceRatio = 15;
let lineHeight = 2;

canvas.width = width;
canvas.height = height;

const MAX_VELOCITY = 4;
const DES_UP = 'up',
  DES_FUTURE = 'future',
  DES_DOWN = 'down';

const DESICIONS = [
  DES_UP,
  DES_FUTURE,
  DES_DOWN,
];

let objsNum = Math.floor(height / offsetY + lineHeight);
let objs = [];

function init() {
  let grd = ctx.createLinearGradient(0, 0, width, height);
  grd.addColorStop(1, "white");
  grd.addColorStop(0, "white");
  ctx.fillStyle = grd;
  
  if (!objs.length) {
    for (var i = 0; i < objsNum; i++) {
      objs.push(newObj(i))
    }
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function makeDesicion() {
  let d = random(0, DESICIONS.length - 1);
  d = DESICIONS[d];
  return d;
}

function runDesicion(o) {
  if (o.d === DES_FUTURE) {
    desicionRunners.future(o);
  } else if (o.d === DES_UP) {
    desicionRunners.up(o);
  } else if (o.d === DES_DOWN) {
    desicionRunners.down(o);
  }
}

const desicionRunners = {
  future: (o) => {
    x = 1 * o.v;
    y = 0;
    draw(o, x, y);
  },
  up: (o) => {
    x = 0;
    y = -1 * o.v;
    draw(o, x, y);
  },
  down: (o) => {
    x = 0;
    y = 1 * o.v;
    draw(o, x, y);
  }
};

function draw(o, x, y) {
  let newX = o.x - x;
  let newY = o.y - y;

  ctx.beginPath();
  ctx.lineWidth = lineHeight;

  ctx.fillRect(newX, newY, lineHeight, lineHeight);

  o.x = newX;
  o.y = newY;
}

function render() {
  //ctx.clearRect(0, 0, width, height);

  for (var i = 0; i < objsNum; i++) {
    let o = objs[i];

    if (o.x < 0) {
      objs[i] = newObj(i);
    }

    if (!o.d || new Date() % minDistanceRatio == 0) {
      o.d = makeDesicion();
    }

    runDesicion(o);
  }
}

function newObj(i) {
  return {
    i,
    x: width,
    y: i * offsetY + lineHeight,
    v: random(1, MAX_VELOCITY),
    sc: `hsl(${random(0, 360)}, 100%, 50%)`,
    d: null
  }
}

init();
animate();

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}