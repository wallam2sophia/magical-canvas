class Snake {
  constructor(options = { width: 600, height: 600, id: "snake", span: 40 }) {
    this.head = [];
    this.body = [];
    this.food = null;
    this.step = 10;
    this.speed = 200;
    this.direction = "RIGHT";
    this.timer = null;
    this.width = options.width || 600;
    this.height = options.height || 600;
    this.canvas = document.getElementById(options.id || "snake");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.init();
  }

  init() {
    // reset
    this.head = [];
    this.body = [];
    this.food = null;
    this.step = 10;
    this.speed = 200;
    this.direction = "RIGHT";
    this.timer = null;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.timer = null;
    // 背景色
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 画出蛇的身体
    this.initSnake(5);
    this.drawSnake();

    this.timer = setInterval(() => {
      this.calPos(this.direction);
    }, this.speed);
    let that = this;
    document.onkeydown = function (e) {
      const code = e.code;
      that.switchDirection(code);
    };
  }
  switchDirection(code) {
    const directionMap = new Map([
      ["ArrowDown", "DOWN"],
      ["ArrowUp", "UP"],
      ["ArrowRight", "RIGHT"],
      ["ArrowLeft", "LEFT"],
    ]);
    this.calPos(directionMap.get(code));
  }
  calPos(direction, type = "move") {
    // 不可以掉头
    if (this.goBack(direction)) {
      return;
    }
    this.direction = direction;
    switch (direction) {
      case "UP":
        // head y-5
        this.body.unshift([this.head[0], this.head[1]]); // 在身体的头部添加蛇头原来的位置
        type === "move" && this.body.pop(); // 删除身体最后一个元素
        this.head[1] -= this.step;
        this.drawSnake();
        break;
      case "DOWN":
        // head x+5
        this.body.unshift([this.head[0], this.head[1]]); // 在身体的头部添加蛇头原来的位置
        type === "move" && this.body.pop(); // 删除身体最后一个元素
        this.head[1] += this.step;
        this.drawSnake();
        break;
      case "RIGHT":
        // head x+5
        this.body.unshift([this.head[0], this.head[1]]); // 在身体的头部添加蛇头原来的位置
        type === "move" && this.body.pop(); // 删除身体最后一个元素
        this.head[0] += this.step;
        this.drawSnake();
        break;
      case "LEFT":
        // head x-5
        this.body.unshift([this.head[0], this.head[1]]); // 在身体的头部添加蛇头原来的位置
        type === "move" && this.body.pop(); // 删除身体最后一个元素
        this.head[0] -= this.step;
        this.drawSnake();
        break;
    }
  }
  goBack(direction) {
    return (
      (this.direction === "UP" && direction === "DOWN") ||
      (this.direction === "DOWN" && direction === "UP") ||
      (this.direction === "LEFT" && direction === "RIGHT") ||
      (this.direction === "RIGHT" && direction === "LEFT")
    );
  }
  initSnake(count) {
    const x =
      Math.round((Math.random() * (this.height - this.step)) / this.step) *
      this.step;
    const y =
      Math.round((Math.random() * (this.width - this.step)) / this.step) *
      this.step;
    this.head = [x, y];
    for (let i = 1; i <= count; i++) {
      this.body.push([x - i * this.step, y]);
    }
  }
  drawSnake() {
    this.ctx.fillStyle = "#000";
    let last = this.body[this.body.length - 1];
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#f00";
    this.ctx.fillRect(this.head[0], this.head[1], this.step, this.step);
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(this.head[0], this.head[1], this.step, this.step);

    for (let i = 0; i < this.body.length; i++) {
      this.ctx.fillStyle = "#0f0";
      this.ctx.fillRect(this.body[i][0], this.body[i][1], this.step, this.step);
      this.ctx.strokeStyle = "#000";
      this.ctx.strokeRect(
        this.body[i][0],
        this.body[i][1],
        this.step,
        this.step
      );
    }
    // 随机放置一个食物
    this.addFood();
    this.eatFood();
    this.isHit();
  }

  isHit() {
    let x = this.head[0];
    let y = this.head[1];
    // 是否碰到左右边界
    const xLimit = x < 0 || x >= this.width;
    // 是否碰到上下边界
    const yLimit = y < 0 || y >= this.height;
    // 是否撞到蛇身
    const hitSelf = this.body.find((item) => x === item[0] && y === item[1]);
    // 三者其中一个为true则游戏结束
    if (xLimit || yLimit || hitSelf) {
      console.log("游戏结束");
      this.gameOver();
    }
  }
  gameOver() {
    clearInterval(this.timer);
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillRect(this.width / 2 - 100, this.height / 2 - 30, 200, 60);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "14px Georgia";
    this.ctx.fillStyle = "#fff";
    const text = `Game Over !`;
    this.ctx.fillText(text, this.width / 2, this.height / 2);
    // 再来一局
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillRect(this.width / 2 - 50, this.height / 2 + 40, 100, 40);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px Georgia";
    this.ctx.fillStyle = "#fff";
    const text1 = `再来一局`;
    this.ctx.fillText(text1, this.width / 2, this.height / 2 + 60);
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
      y > this.height / 2 + 40 &&
      y < this.height / 2 + 80
    ) {
      this.init();
    }
    //   this.canvas.onclick = onClick;
  }
  addFood() {
    let color =
      this.food !== null
        ? this.food[2] === "yellow"
          ? "black"
          : "yellow"
        : "yellow";
    if (this.food !== null) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(this.food[0], this.food[1], this.step, this.step);
      this.ctx.strokeStyle = "#000";
      this.ctx.strokeRect(this.food[0], this.food[1], this.step, this.step);
      this.food[2] = color;
      return;
    }
    let x, y, isInsnake;
    do {
      x =
        Math.round((Math.random() * (this.height - this.step)) / this.step) *
        this.step;
      y =
        Math.round((Math.random() * (this.width - this.step)) / this.step) *
        this.step;
      if (
        (x === this.head[0] && y === this.head[1]) ||
        this.body.find((item) => x === item[0] && y === item[1])
      ) {
        isInsnake = true;
      } else {
        isInsnake = false;
      }
    } while (isInsnake);
    this.food = [x, y, color];
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.step, this.step);
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(this.food[0], this.food[1], this.step, this.step);
  }

  eatFood() {
    if (this.head[0] === this.food[0] && this.head[1] === this.food[1]) {
      this.calPos(this.direction, "eat"); // 重新绘制蛇头
      this.food = null;
      this.addFood(); // 重置食物
    }
  }
}
