class Cheek {
  constructor(
    options = {
      width: 600,
      height: 600,
      id: "cheek",
      span: 40,
      player: 1,
      wait: 3,
    }
  ) {
    this.options = options;
    this.cheeks = []; // 1: 白子 2：黑子
    this.player = options.player || 1; // 1: 白子 2：黑子
    this.wait = options.wait || 3; // 等待对方下棋时间
    this.span = options.span || 40;
    this.width = options.width || 600;
    this.height = options.height || 600;
    this.canvas = document.getElementById(options.id || "cheek");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.loading = new Loading(this.width, this.height);
    this.init();
  }
  init() {
    // 背景色
    this.cheeks = [];
    this.player = this.options.player || 1;
    this.ctx.fillStyle = "#eee";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // 网格
    for (let i = 1; i <= this.width / this.span; i++) {
      // 竖线
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#0f0";
      this.ctx.lineWidth = 0.3;
      this.ctx.moveTo(i * this.span, 0);
      this.ctx.lineTo(i * this.span, this.width);
      this.ctx.stroke();
      this.ctx.closePath();
      // 横线
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#0f0";
      this.ctx.lineWidth = 0.3;
      this.ctx.moveTo(0, i * this.span);
      this.ctx.lineTo(this.height, i * this.span);
      this.ctx.stroke();
      this.ctx.closePath();

      // 填充棋子
      this.cheeks.push(new Array(this.width / this.span).fill(0));
    }
    let that = this;
    this.canvas.onclick = function (e) {
      that.onClick(e);
    };
  }
  onClick(e) {
    const x = this.findPos(e.offsetX);
    const y = this.findPos(e.offsetY);
    this.drawDot(x, y); // 画一个点
  }
  findPos(originP) {
    const a = Math.floor(originP / this.span);
    const b = originP % this.span;
    if (b > this.span / 2) {
      return this.span * (a + 1);
    } else {
      return this.span * a;
    }
  }
  drawDot(x, y, flag = true) {
    const row = y / this.span;
    const col = x / this.span;
    if (!this.isvalidDot(row, col)) {
      return false;
    }
    this.ctx.fillStyle = this.player === 1 ? "white" : "black";
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 15, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.cheeks[row][col] = this.player;
    const result = this.isWin(row, col, this.player); // 判断是否游戏结束
    if (result) {
      console.log(`游戏结束,${this.player === 1 ? "白子" : "黑子"}赢了!`);
      this.gameOver();
      return;
    }
    this.toggleColor(); // 切换颜色
    if (flag) {
      this.startLoading();
      let that = this;
      let wait = Math.random() * that.wait * 1000;
      setTimeout(function () {
        that.robotPlayer(row, col);
      }, wait);
    }
  }
  startLoading(text = "等待对手出棋中...") {
    this.loading.startLoading(text);
  }
  isvalidDot(row, col) {
    if (
      row === 0 ||
      col === 0 ||
      row === this.width / this.span ||
      col === this.height / this.span
    ) {
      return false;
    }
    return !this.cheeks[row][col];
  }
  toggleColor() {
    this.player === 1 ? (this.player = 2) : (this.player = 1);
  }
  isWin(row, col, player) {
    // 判断垂直方向上是否有5颗连子
    if (this.up_down(row, col, player)) {
      return true;
    }
    // 判断水平方向上是否有5颗连子
    if (this.left_right(row, col, player)) {
      return true;
    }
    // 判断左上-右下方向上是否有5颗连子
    if (this.lu_rd(row, col, player)) {
      return true;
    }
    // 判断右上-左下方向上是否有5颗连子
    if (this.ru_ld(row, col, player)) {
      return true;
    }
    return false;
  }
  gameOver() {
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillRect(this.width / 2 - 100, this.height / 2 - 30, 200, 60);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "14px Georgia";
    this.ctx.fillStyle = "#fff";
    const text = `游戏结束,${
      this.options.player === this.player ? "我方" : "对方"
    }赢了!`;
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
  up_down(row, col, player) {
    let num = 1;
    // 往上找最多4颗
    for (let i = row - 1; i > row - 5 && i > 0; i--) {
      if (this.cheeks[i][col] === player) {
        num += 1;
      } else {
        break;
      }
    }
    // 往下找最多4颗
    for (let i = row + 1; i < row + 5 && i < this.width / this.span; i++) {
      if (this.cheeks[i][col] === player) {
        num += 1;
      } else {
        break;
      }
    }
    if (num >= 5) {
      return true;
    }
    return false;
  }
  left_right(row, col, player) {
    let num = 1;
    // 往左找最多4颗
    for (let i = col - 1; i > col - 5 && i > 0; i--) {
      if (this.cheeks[row][i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    // 往右找最多4颗
    for (let i = col + 1; i < col + 5 && i < this.width / this.span; i++) {
      if (this.cheeks[row][i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    if (num >= 5) {
      return true;
    }
    return false;
  }
  lu_rd(row, col, player) {
    let num = 1;
    // 往左上找最多4颗
    for (let i = 1; i <= 5 && row - i >= 0 && col - i >= 0; i++) {
      if (this.cheeks[row - i][col - i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    // 往右下找最多4颗
    for (
      let i = 1;
      i <= 5 &&
      row + i < this.width / this.span &&
      col + i < this.width / this.span;
      i++
    ) {
      if (this.cheeks[row + i][col + i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    if (num >= 5) {
      return true;
    }
    return false;
  }
  ru_ld(row, col, player) {
    let num = 1;
    // 往右上找最多4颗
    for (
      let i = 1;
      i <= 5 && row + i < this.width / this.span && col - i >= 0;
      i++
    ) {
      if (this.cheeks[row + i][col - i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    // 往左下找最多4颗
    for (
      let i = 1;
      i <= 5 && col + i < this.width / this.span && row - i >= 0;
      i++
    ) {
      if (this.cheeks[row - i][col + i] === player) {
        num += 1;
      } else {
        break;
      }
    }
    if (num >= 5) {
      return true;
    }
    return false;
  }
  robotPlayer(o_row, o_col) {
    let x, y, row, col, isValid;
    let row_range = [o_row, o_row + 1, o_row - 1];
    let col_range = [o_col, o_col + 1, o_col - 1];
    do {
      // x = this.findPos(Math.round(Math.random() * this.width));
      // y = this.findPos(Math.round(Math.random() * this.height));
      row = row_range[Math.floor(Math.random() * row_range.length)];
      col = col_range[Math.floor(Math.random() * col_range.length)];
      x = col * this.span;
      y = row * this.span;
      isValid = this.isvalidDot(row, col);
    } while (!isValid);
    this.drawDot(x, y, false);
    this.loading.stopLoading();
  }
}
