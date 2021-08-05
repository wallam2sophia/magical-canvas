class Box {
  constructor(options = { width: 600, height: 600, id: "box" }) {
    this.options = options;
    this.score = 0;
    this.direction = "DOWN";
    this.timer = null;
    this.size = 10;
    this.wait = 200;
    this.shapes = [];
    this.destory = true;
    this.width = options.width || 600;
    this.height = options.height || 600;
    this.canvas = document.getElementById(options.id || "box");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.init();
  }
  init() {
    // reset
    this.score = 0;
    this.shapes = [];
    // 背景色
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.addShape(this.width / 2, 0);
    let that = this;
    document.onkeydown = function (e) {
      const code = e.code;
      const directionMap = new Map([
        ["ArrowDown", "DOWN"],
        ["ArrowRight", "RIGHT"],
        ["ArrowLeft", "LEFT"],
      ]);
      if (code === "ArrowUp") {
        that.translateShape();
      }
      if (directionMap.has(code)) {
        // 移动
        let direction = directionMap.get(code);
        that.moveShape(direction, 10, that.destory);
      }
    };
  }
  addShape(x, y) {
    let shapes = [
      "Shape1",
      //   "Shape2",
      //   "Shape2",
      //   "Shape2",
      //   "Shape3",
      //   "Shape3",
      //   "Shape3",
      //   "Shape4",
      "Shape5",
      "Shape5",
      "Shape5",
      //   "Shape6",
      //   "Shape6",
      //   "Shape6",
    ];
    let shape = shapes[Math.floor(Math.random() * shapes.length)];
    let degs = [0, 1, 2, 3];
    let deg = degs[Math.floor(Math.random() * degs.length)];
    this.shapes.push(
      eval(`new ${shape}(this.ctx, x, y, this.width, this.height, deg)`)
    );
    this.animate();
  }
  animate() {
    let curShape = this.shapes[this.shapes.length - 1];
    let that = this;
    this.timer = setInterval(() => {
      that.moveShape(that.direction, 10, this.destory);
    }, that.wait);
  }
  moveShape(direction, offset) {
    let curShape = this.shapes[this.shapes.length - 1];
    curShape.move(direction, offset, this.destory);
    this.stopShape();
    this.removeShape();
  }
  translateShape() {
    // 翻转
    let curShape = this.shapes[this.shapes.length - 1];
    curShape.translate();
    this.stopShape();
  }
  stopShape() {
    let curShape = this.shapes[this.shapes.length - 1];
    let flag = curShape.isStop();
    if (flag === 1) {
      // 下一个方块
      clearInterval(this.timer);
      this.direction = "DOWN";
      this.addShape(this.width / 2, 0);
    } else if (flag === -1) {
      // 游戏结束
      clearInterval(this.timer);
      this.gameOver();
    } else if (flag === 2) {
      // 单个矩形透传
      this.destory = false;
    }
  }
  gameOver() {
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillRect(this.width / 2 - 100, this.height / 2 - 30, 200, 80);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "14px Georgia";
    this.ctx.fillStyle = "#fff";
    const text = `Game Over !`;
    this.ctx.fillText("Game Over !", this.width / 2, this.height / 2);
    this.ctx.fillText(
      `SCORE： ${this.score}`,
      this.width / 2,
      this.height / 2 + 30
    );
    // 再来一局
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillRect(this.width / 2 - 50, this.height / 2 + 80, 100, 40);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px Georgia";
    this.ctx.fillStyle = "#fff";
    const text1 = `再来一局`;
    this.ctx.fillText(text1, this.width / 2, this.height / 2 + 100);
    let that = this;
    this.canvas.onclick = function (e) {
      that.onceAgin(e);
    };
  }
  onceAgin(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (
      x < this.width / 2 + 50 &&
      x > this.width / 2 - 50 &&
      y > this.height / 2 + 80 &&
      y < this.height / 2 + 100
    ) {
      this.init();
    }
    //   this.canvas.onclick = onClick;
  }
  removeShape() {
    // 消除填满的行
    for (let i = this.height / this.size - 1; i >= 0; i--) {
      let pixels = this.ctx.getImageData(0, i * 10, this.width, 10).data;
      let flag = true;
      for (let i = 0; i < 4000; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let a = pixels[i + 3];
        if (r === 0 && g === 0 && b === 0 && a === 255) {
          // 有黑色像素代表没有填满
          flag = false;
        }
      }
      if (flag) {
        this.shapes.forEach((shape) => {
          if (shape.y <= i * this.size) {
            shape.move("DOWN", this.size, this.destory, true);
            this.score += 50;
          }
        });
      }
    }
  }
}
class Rect {
  constructor(ctx, x, y, width, height, size = 10) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.flag = true;
    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x >= this.width ||
      this.y >= this.height
    ) {
      this.flag = false;
    }
  }
  draw(color) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = "#000";
    this.ctx.beginPath();
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
    this.ctx.strokeRect(this.x, this.y, this.size, this.size);
    this.ctx.closePath();
  }
}
class Shape {
  constructor(ctx, x, y, width, height, deg, size = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.size = size;
    this.ctx = ctx;
    this.deg = deg;
    this.points = [];
    let colors = ["#f00", "#0f0", "#00f"];
    // this.color = colors[Math.floor(Math.random() * colors.length)];
    this.color = "#0f0";
  }
  draw(destroy, fn) {
    let oldPoints = this.points.slice();
    destroy && this.clear(oldPoints);
    let flag = fn();
    if (!flag) {
      this.points = oldPoints;
      this.x = this.points[0].x;
      this.y = this.points[0].y;
    }
    this.points.forEach((item) => item.draw(this.color));
  }
  move(direction, offset, destroy = true, force = false) {
    if (direction == "RIGHT") {
      this.x += offset;
    } else if (direction == "LEFT") {
      this.x -= offset;
    } else {
      this.y += offset;
    }
    this.draw(direction, destroy, force);
  }
  clear(points) {
    this.ctx.fillStyle = "#000";
    for (let point of points) {
      this.ctx.fillRect(point.x, point.y, this.size, this.size);
    }
    this.points = [];
  }
  isStop() {
    let lowEstY = this.points.reduce((acc, item) => {
      if (item.y > acc) {
        return item.y;
      } else {
        return acc;
      }
    }, this.points[0].y);
    let highEstY = this.points.reduce((acc, item) => {
      if (item.y < acc) {
        return item.y;
      } else {
        return acc;
      }
    }, this.points[0].y);
    // if (highEstY <= 0) {
    //   console.log("到顶了");
    //   return -1;
    // }
    if (lowEstY + 10 >= this.height) {
      console.log("到底了");
      return 1;
    }
    if (this.points.length === 1) {
      // 单个矩形特殊处理
      let { x, y } = this.points[0];
      for (let j = this.height - 10; j > y; j -= 10) {
        let pixel = this.ctx.getImageData(x, j, 10, 10).data;
        let isblack = this.isBlack(pixel);
        if (isblack) {
          // 该点的下方有黑色
          return 0;
        }
      }
      return 1;
    } else {
      let y_list = this.points.map((item) => item.y);
      for (let point of this.points) {
        let { x, y } = point;
        let pixel = this.ctx.getImageData(x, y + 10, 10, 10).data;
        let isblack = this.isBlack(pixel);
        if (!isblack && !y_list.includes(y + 10)) {
          // 碰上了
          if (highEstY <= 0) {
            return -1;
          } else {
            return 1;
          }
        }
      }
    }
    return 0;
  }
  isBlack(pixel) {
    let count = pixel.length / 4;
    for (let i = 0; i < count; i += 4) {
      let r = pixel[i];
      let g = pixel[i + 1];
      let b = pixel[i + 2];
      let a = pixel[i + 3];
      if (r !== 0 || g !== 0 || b !== 0 || a !== 255) {
        // 检查的图形中有一个像素不是黑色
        return false;
      }
    }
    return true;
  }
  translate() {
    this.deg = (this.deg + 1) % 4;
  }
}
class Shape1 extends Shape {
  // 单个矩形
  constructor(ctx, x, y, width, height, deg, size = 10, color = "#0f0") {
    super(ctx, x, y, width, height, deg);
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    let fn = () => {
      this.points.push(
        new Rect(this.ctx, this.x, this.y, this.width, this.height)
      );
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
}
class Shape2 extends Shape {
  // 田字格
  constructor(ctx, x, y, width, height, deg, size = 10, color = "#0f0") {
    super(ctx, x, y, width, height, deg);
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    // 田字格
    let fn = () => {
      let poses = this.getPos(this.x, this.y);
      poses.forEach((pos) => {
        this.points.push(
          new Rect(this.ctx, pos[0], pos[1], this.width, this.height)
        );
      });
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
  getPos(x, y) {
    return [
      [x, y],
      [x + this.size, y],
      [x, y + this.size],
      [x + this.size, y + this.size],
    ];
  }
}
class Shape3 extends Shape {
  // 品字形
  constructor(ctx, x, y, width, height, deg, size = 10, color = "#0f0") {
    super(ctx, x, y, width, height, deg);
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    let fn = () => {
      let poses = this.getPos(this.x, this.y);
      poses.forEach((pos) => {
        this.points.push(
          new Rect(this.ctx, pos[0], pos[1], this.width, this.height)
        );
      });
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
  getPos(x, y) {
    if (this.deg === 0) {
      return [
        [x, y],
        [x, y - this.size],
        [x - this.size, y],
        [x + this.size, y],
      ];
    } else if (this.deg === 1) {
      return [
        [x, y],
        [x, y - this.size],
        [x, y + this.size],
        [x + this.size, y],
      ];
    } else if (this.deg === 2) {
      return [
        [x, y],
        [x - this.size, y],
        [x + this.size, y],
        [x, y + this.size],
      ];
    } else if (this.deg === 3) {
      return [
        [x, y],
        [x, y - this.size],
        [x, y + this.size],
        [x - this.size, y],
      ];
    }
  }
}
class Shape4 extends Shape {
  constructor(
    ctx,
    x,
    y,
    width,
    height,
    deg,
    size = 10,
    color = "#0f0",
    direction = "horitical"
  ) {
    super(ctx, x, y, width, height, deg);
    this.direction = direction;
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    let fn = () => {
      let poses = this.getPos(this.x, this.y);
      poses.forEach((pos) => {
        this.points.push(
          new Rect(this.ctx, pos[0], pos[1], this.width, this.height)
        );
      });
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
  getPos(x, y) {
    if (this.deg === 0) {
      return [
        [x, y],
        [x - this.size, y],
        [x - 2 * this.size, y],
        [x - 3 * this.size, y],
        [x + this.size, y],
        [x + 2 * this.size, y],
      ];
    } else if (this.deg === 1) {
      return [
        [x, y],
        [x, y - this.size],
        [x, y - 2 * this.size],
        [x, y - 3 * this.size],
        [x, y + this.size],
        [x, y + 2 * this.size],
      ];
    } else if (this.deg === 2) {
      return [
        [x, y],
        [x - this.size, y],
        [x - 2 * this.size, y],
        [x + this.size, y],
        [x + 2 * this.size, y],
        [x + 3 * this.size, y],
      ];
    } else if (this.deg === 3) {
      return [
        [x, y],
        [x, y - this.size],
        [x, y - 2 * this.size],
        [x, y + this.size],
        [x, y + 2 * this.size],
        [x, y + 3 * this.size],
      ];
    }
  }
}
class Shape5 extends Shape {
  constructor(
    ctx,
    x,
    y,
    width,
    height,
    deg,
    size = 10,
    color = "#0f0",
    direction = "horitical"
  ) {
    super(ctx, x, y, width, height, deg);
    this.direction = direction;
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    let fn = () => {
      let poses = this.getPos(this.x, this.y);
      poses.forEach((pos) => {
        this.points.push(
          new Rect(this.ctx, pos[0], pos[1], this.width, this.height)
        );
      });
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
  getPos(x, y) {
    if (this.deg === 0) {
      return [
        [x, y],
        [x - this.size, y - this.size],
        [x, y - this.size],
        [x + this.size, y],
      ];
    } else if (this.deg === 1) {
      return [
        [x, y],
        [x + this.size, y],
        [x + this.size, y - this.size],
        [x, y + this.size],
      ];
    } else if (this.deg === 2) {
      return [
        [x, y],
        [x, y - this.size],
        [x + this.size, y - this.size],
        [x - this.size, y],
      ];
    } else if (this.deg === 3) {
      return [
        [x, y],
        [x, y - this.size],
        [x + this.size, y],
        [x + this.size, y + this.size],
      ];
    }
  }
}
class Shape6 extends Shape {
  constructor(ctx, x, y, width, height, deg, size = 10, color = "#0f0") {
    super(ctx, x, y, width, height, deg);
    this.draw();
  }
  draw(direction = "DOWN", destory = true, force = false) {
    let fn = () => {
      let poses = this.getPos(this.x, this.y);
      poses.forEach((pos) => {
        this.points.push(
          new Rect(this.ctx, pos[0], pos[1], this.width, this.height)
        );
      });
      let flag = this.points.reduce((acc, item) => {
        return acc && item.flag;
      }, true);
      return !(!flag && direction !== "DOWN" && !force);
    };
    super.draw(destory, fn);
  }
  getPos(x, y) {
    if (this.deg === 0) {
      return [
        [x, y],
        [x, y - this.size],
        [x + this.size, y],
        [x + 2 * this.size, y],
      ];
    } else if (this.deg === 1) {
      return [
        [x, y],
        [x + this.size, y],
        [x, y + this.size],
        [x, y + 2 * this.size],
      ];
    } else if (this.deg === 2) {
      return [
        [x, y],
        [x, y + this.size],
        [x - this.size, y],
        [x - 2 * this.size, y],
      ];
    } else if (this.deg === 3) {
      return [
        [x, y],
        [x - this.size, y],
        [x, y - this.size],
        [x, y - 2 * this.size],
      ];
    }
  }
}
