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
    this.competitor = null;
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
    // 创建一个渐变色，使棋子更立体
    const radialGradient = this.ctx.createRadialGradient(
      x + 2,
      y - 2,
      15,
      x + 2,
      y - 2,
      0
    );
    if (this.player === 1) {
      radialGradient.addColorStop(0, "#d1d1d1");
      radialGradient.addColorStop(1, "#f9f9f9");
    } else {
      radialGradient.addColorStop(0, "#0a0a0a");
      radialGradient.addColorStop(1, "#636766");
    }
    this.ctx.fillStyle = radialGradient;
    // this.ctx.fillStyle = this.player === 1 ? "white" : "black";
    // this.ctx.shadowBlur = 20;
    // this.ctx.shadowColor = "black";
    // this.ctx.shadowOffsetX = 2;
    // this.ctx.shadowOffsetY = 2;
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
    let pos_range;
    if (flag) {
      pos_range = this.bestPos(row, col, this.player);
    }
    this.toggleColor(); // 切换玩家
    if (flag) {
      this.startLoading();
      let that = this;
      let wait = Math.random() * that.wait * 1000;
      setTimeout(function () {
        that.robotPlayer(row, col, pos_range);
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
    if (this.up_down(row, col, player)[0] >= 5) {
      return true;
    }
    // 判断水平方向上是否有5颗连子
    if (this.left_right(row, col, player)[0] >= 5) {
      return true;
    }
    // 判断左上-右下方向上是否有5颗连子
    if (this.lu_rd(row, col, player)[0] >= 5) {
      return true;
    }
    // 判断右上-左下方向上是否有5颗连子
    if (this.ru_ld(row, col, player)[0] >= 5) {
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
    let row1 = row;
    let row2 = row;
    let col1 = col;
    let col2 = col;
    // 往上找最多4颗
    for (let i = row - 1; i > row - 5 && i > 0; i--) {
      if (this.cheeks[i][col] === player) {
        num += 1;
        row1 = i;
      } else {
        break;
      }
    }
    // 往下找最多4颗
    for (let i = row + 1; i < row + 5 && i < this.width / this.span; i++) {
      if (this.cheeks[i][col] === player) {
        num += 1;
        row2 = i;
      } else {
        break;
      }
    }
    return [num, row1, col1, row2, col2];
  }
  left_right(row, col, player) {
    let num = 1;
    let row1 = row;
    let row2 = row;
    let col1 = col;
    let col2 = col;
    // 往左找最多4颗
    for (let i = col - 1; i > col - 5 && i > 0; i--) {
      if (this.cheeks[row][i] === player) {
        num += 1;
        col1 = i;
      } else {
        break;
      }
    }
    // 往右找最多4颗
    for (let i = col + 1; i < col + 5 && i < this.width / this.span; i++) {
      if (this.cheeks[row][i] === player) {
        num += 1;
        col2 = i;
      } else {
        break;
      }
    }
    return [num, row1, col1, row2, col2];
  }
  lu_rd(row, col, player) {
    let num = 1;
    let row1 = row;
    let row2 = row;
    let col1 = col;
    let col2 = col;
    // 往左上找最多4颗
    for (let i = 1; i <= 5 && row - i >= 0 && col - i >= 0; i++) {
      if (this.cheeks[row - i][col - i] === player) {
        num += 1;
        col1 = col - i;
        row1 = row - i;
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
        col2 = col + i;
        row2 = row + i;
      } else {
        break;
      }
    }
    return [num, row1, col1, row2, col2];
  }
  ru_ld(row, col, player) {
    let num = 1;
    let row1 = row;
    let row2 = row;
    let col1 = col;
    let col2 = col;
    // 往右上找最多4颗
    for (
      let i = 1;
      i <= 5 && row + i < this.width / this.span && col - i >= 0;
      i++
    ) {
      if (this.cheeks[row + i][col - i] === player) {
        num += 1;
        col1 = col - i;
        row1 = row + i;
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
        col2 = col + i;
        row2 = row - i;
      } else {
        break;
      }
    }
    return [num, row1, col1, row2, col2];
  }
  bestPos(o_row, o_col, player) {
    let obj = {};
    obj.ud = this.up_down(o_row, o_col, player);
    obj.lr = this.left_right(o_row, o_col, player);
    obj.lu = this.lu_rd(o_row, o_col, player);
    obj.ru = this.ru_ld(o_row, o_col, player);
    let direction = "ud";
    let maxNum = obj[direction][0];
    for (let key in obj) {
      if (obj[key][0] > maxNum) {
        maxNum = obj[key][0];
        direction = key;
      }
    }
    if (maxNum >= 3) {
      let pos1 = [obj[direction][1], obj[direction][2]];
      let pos2 = [obj[direction][3], obj[direction][4]];
      if (direction === "ud") {
        let pos_range = [
          [pos1[0] - 1, pos1[1]],
          [pos2[0] + 1, pos2[1]],
        ];
        return pos_range;
      } else if (direction === "lr") {
        let pos_range = [
          [pos1[0], pos1[1] - 1],
          [pos2[0], pos2[1] + 1],
        ];
        return pos_range;
      } else if (direction === "lu") {
        let pos_range = [
          [pos1[0] - 1, pos1[1] - 1],
          [pos2[0] + 1, pos2[1] + 1],
        ];
        return pos_range;
      } else if (direction === "ru") {
        let pos_range = [
          [pos1[0] + 1, pos1[1] - 1],
          [pos2[0] - 1, pos2[1] + 1],
        ];
        return pos_range;
      }
    }
  }
  robotPlayer(o_row, o_col, pos_range) {
    let x, y, row, col, isValid;
    if (pos_range && this.isvalidDot(pos_range[0][0], pos_range[0][1])) {
      x = pos_range[0][1] * this.span;
      y = pos_range[0][0] * this.span;
    } else if (pos_range && this.isvalidDot(pos_range[1][0], pos_range[1][1])) {
      x = pos_range[1][1] * this.span;
      y = pos_range[1][0] * this.span;
    } else if (this.competitor) {
      let c_row = this.competitor[0];
      let c_col = this.competitor[1];
      let row_range = [c_row, c_row + 1, c_row - 1];
      let col_range = [c_col, c_col + 1, c_col - 1];
      do {
        row = row_range[Math.floor(Math.random() * row_range.length)];
        col = col_range[Math.floor(Math.random() * col_range.length)];
        x = col * this.span;
        y = row * this.span;
        isValid = this.isvalidDot(row, col);
      } while (!isValid);
    } else {
      let row_range = [o_row, o_row + 1, o_row - 1];
      let col_range = [o_col, o_col + 1, o_col - 1];
      do {
        row = row_range[Math.floor(Math.random() * row_range.length)];
        col = col_range[Math.floor(Math.random() * col_range.length)];
        x = col * this.span;
        y = row * this.span;
        isValid = this.isvalidDot(row, col);
      } while (!isValid);
    }
    this.competitor = [y / this.span, x / this.span];
    this.drawDot(x, y, false);
    this.loading.stopLoading();
  }
}
