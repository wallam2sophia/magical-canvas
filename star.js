class Star {
  constructor(options = { width: 600, height: 600, id: "star", span: 40 }) {
    this.timer = null;
    this.r = 3;
    this.dots = [];
    this.nums = 100;
    this.span = 30;
    this.width = options.width || 600;
    this.height = options.height || 600;
    this.mouseStar = null;
    this.canvas = document.getElementById(options.id || "star");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#fff";
    this.init();
    let that = this;
    this.canvas.onmousemove = function (e) {
      that.mouseStar = new Dot(
        that.width,
        that.height,
        that.r,
        that.ctx,
        e.offsetX,
        e.offsetY
      );
    };
    this.canvas.onclick = function (e) {
      that.draw(5, e.offsetX, e.offsetY);
    };
  }
  init() {
    this.draw();
    this.animate();
  }
  draw(nums, x, y) {
    nums = nums || this.nums;
    for (let i = 0; i < nums; i++) {
      let dot = new Dot(this.width, this.height, this.r, this.ctx, x, y);
      this.dots.push(dot);
    }
  }
  line(src, dst) {
    let x = Math.abs(src.x - dst.x);
    let y = Math.abs(src.y - dst.y);
    if (x < 50 && y < this.span) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(src.x, src.y);
      this.ctx.lineTo(dst.x, dst.y);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
  handleLine() {
    let dots = this.dots.slice();
    if (this.mouseStar) {
      dots.push(this.mouseStar);
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = 1; j < dots.length; j++) {
        this.line(dots[i], dots[j]);
      }
    }
  }
  animate() {
    let that = this;
    setInterval(() => {
      that.ctx.clearRect(0, 0, that.width, that.height);
      that.dots.forEach((dot) => dot.animate());
      if (that.mouseStar) {
        that.mouseStar.draw();
      }
      that.handleLine();
    }, 50);
  }
}

class Dot {
  constructor(width, height, r, ctx, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || Math.round(Math.random() * width);
    this.y = y || Math.round(Math.random() * height);
    this.r = r;
    this.ctx = ctx;
    // speed参数，在  -3 ~ 3 之间取值
    this.speedX =
      Math.random() * this.r * Math.pow(-1, Math.round(Math.random()));
    this.speedY =
      Math.random() * this.r * Math.pow(-1, Math.round(Math.random()));
    this.draw();
  }
  draw() {
    // drawSeries(this.ctx);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    this.x -= this.speedX;
    this.y -= this.speedY;
    if (this.x < 0 || this.x > this.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > this.height) {
      this.speedY *= -1;
    }
  }
  animate() {
    this.move();
    this.draw();
  }
}
function drawSeries(context) {
  context.beginPath();
  context.lineWidth = 1;
  context.moveTo(0, 0);
  context.lineTo(200, 0);
  context.stroke();
  context.closePath();
  context.beginPath();
  context.font = "14px Georgia";
  context.fillText("x", 205, 10);
  context.closePath();
  context.beginPath();
  context.lineWidth = 1;
  context.moveTo(0, 0);
  context.lineTo(0, 200);
  context.stroke();
  context.closePath();
  context.beginPath();
  context.font = "14px Georgia";
  context.fillText("y", 10, 205);
  context.fill();
  context.closePath();
}
