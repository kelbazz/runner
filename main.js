const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
requestAnimationFrame(mainLoop); // starts the animation

const gravity = { x: 0, y: 0.8 };
const ground = ctx.canvas.height - 50; // ground at bottom of canvas.

let points = 0;
let running = true;
let vitess = 5;

class Object {
  constructor(x, y, w, h, b) {
    this.bounce = b;
    this.pos = { x, y }; // position halfway on canvas
    this.vel = { x: 0, y: 0 }; // velocity
    this.size = { w, h };
  }

  update() {
    this.vel.x += gravity.x;
    this.vel.y += gravity.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    const g = ground - this.size.h; // adjust for size
    if (this.pos.y >= g) {
      this.pos.y = g - (this.pos.y - g); //
      this.vel.y = -Math.abs(this.vel.y) * this.bounce;
      if (this.vel.y >= -gravity.y) {
        // check for rest.
        this.vel.y = 0;
        this.pos.y = g - gravity.y;
      }
    }
  }
  draw() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
  }
}

class Player extends Object {
  constructor(...args) {
    super(...args);

    canvas.addEventListener("click", () => {
      if (this.vel.y > -gravity.y) {
        this.vel.y -= 15;
      }
    });
  }
}

class Enemy extends Object {
  constructor() {
    super(ctx.canvas.width, ctx.canvas.height + ground - 60, 20, 60, 0);
    // super(10, 10, 20, 60, 0.1);
  }

  update() {
    this.vel.x = -vitess;
    super.update();

    let x1 = this.pos.x;
    let y1 = this.pos.y;
    let w1 = this.size.w;
    let h1 = this.size.h;
    let x2 = player.pos.x;
    let y2 = player.pos.y;
    let w2 = player.size.w;
    let h2 = player.size.h;
    let isColliding = true;

    w2 += x2;
    w1 += x1;
    if (x2 > w1 || x1 > w2) return false;
    h2 += y2;
    h1 += y1;
    if (y2 > h1 || y1 > h2) return false;

    if (isColliding) {
      running = false;
    }
  }
}

let player = new Player(50, -50, 50, 50, 0.2);

const entities = [player];

function mainLoop() {
  ctx.fillStyle = "#0f102022";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, ground, ctx.canvas.width, ctx.canvas.height - ground);
  ctx.font = "50px monospace";
  ctx.fillText(running ? `${points}pts` : `Perdu ! (${points}pts)`, 40, 80);

  entities.forEach((entity) => {
    entity.update(); // move object
    entity.draw();
  });

  if (running) {
    requestAnimationFrame(mainLoop);
  } else {
    setTimeout(() => {
      requestAnimationFrame(mainLoop);
      canvas.style.pointerEvents = "none";
    }, 100);
  }
}

setInterval(() => {
  if (Math.round(Math.random()) >= 1 && running) {
    entities.push(new Enemy());
    setTimeout(() => {
      if (running) {
        points += 1;
        vitess += 0.001;
      }
    }, 500);
  }
}, 1000);
