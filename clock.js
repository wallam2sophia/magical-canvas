class Clock {
  constructor(options = { width: 600, height: 600, id: "clock" }) {
    this.width = options.width || 600;
    this.height = options.height || 600;
    this.outR = 180;
    this.innerR = 170;
    this.canvas = document.getElementById(options.id || "clock");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.init();
  }
  init() {
    this.ctx.translate(this.width / 2, this.height / 2);
    // this.ctx.rotate((270 * Math.PI) / 180);
    // 黑色背景
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.ctx.save();
    // 外层大圆
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.outR, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.closePath();
    // 内层层大圆
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.outR - 10, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.closePath();

    // 画刻度
    this.drawTick();
    // 画数字
    this.drawLabel();
    // drawSeries();
    this.drawTime();
    let that = this;
    setInterval(() => {
      that.drawTime();
    }, 1000);
  }
  drawTick() {
    for (let i = 0; i < 60; i++) {
      this.ctx.rotate(((i * 6 + 270) * Math.PI) / 180);
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = 1;
      if (i % 5 === 0) {
        this.ctx.moveTo(150, 0);
        this.ctx.lineTo(170, 0);
      } else {
        this.ctx.moveTo(160, 0);
        this.ctx.lineTo(170, 0);
      }
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      this.ctx.save();
    }
  }
  drawLabel() {
    for (let i = 1; i <= 12; i++) {
      const deg = (i * 30 * Math.PI) / 180;
      const x = 140 * Math.sin(deg);
      const y = 140 * Math.cos(deg);
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      if (i % 3 === 0) {
        this.ctx.font = "14px Georgia";
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(i, x, -y);
      }
    }
  }
  drawTime() {
    this.ctx.fillStyle = "#000";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 130, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();

    let timeStr = new Date();
    let year = timeStr.getFullYear();
    let month = timeStr.getMonth() + 1;
    let day = timeStr.getDate();
    let hour = timeStr.getHours();
    let minute = timeStr.getMinutes();
    let second = timeStr.getSeconds();

    let hourDeg = (hour > 12 ? hour - 12 : hour) * 30 + 270;
    let minuteDeg = minute * 6 + 270;
    let secondDeg = second * 6 + 270;
    // console.log(hour, minute, second, hourDeg, minuteDeg);
    // 时间描述
    this.drawText(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
      `${year}年${month}月${day}日`
    );
    this.drawHour(hourDeg);
    this.drawMinute(minuteDeg);
    this.drawSecond(secondDeg);
    // 中心小圆
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawHour(deg = 0) {
    // 画时针
    this.ctx.rotate((deg * Math.PI) / 180);
    this.drawclockHand(-5, -4, 60, 0, 60, 1, -5, 4);
    // drawArc(0, -7, 60, 0, (10 * Math.PI) / 180, true);
    this.ctx.restore();
    this.ctx.save();
  }
  drawMinute(deg = 0) {
    // 画分针
    this.ctx.rotate((deg * Math.PI) / 180);
    this.drawclockHand(-5, -3, 80, 0, 80, 1, -5, 3);
    // drawArc(-80, -5, 80, 0, (6 * Math.PI) / 180);
    this.ctx.restore();
    this.ctx.save();
  }
  drawSecond(deg = 0) {
    // 画秒针
    this.ctx.rotate((deg * Math.PI) / 180);
    this.drawclockHand(-5, -2, 110, 0, 110, 1, -5, 2);
    // drawArc(-110, -4, 110, 0, (4 * Math.PI) / 180);
    this.ctx.restore();
    this.ctx.save();
  }
  drawText(title, subTitle) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "normal bolder 20px 微软雅黑";
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(title, 0, -90);
    this.ctx.font = "normal 100 12px Aria";
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(subTitle, 0, -65);
  }
  drawclockHand(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x4, y4);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

function drawSeries() {
  this.ctx.strokeStyle = "#000";
  this.ctx.beginPath();
  this.ctx.lineWidth = 1;
  this.ctx.moveTo(-100, 0);
  this.ctx.lineTo(100, 0);
  this.ctx.stroke();
  this.ctx.closePath();
  this.ctx.beginPath();
  this.ctx.font = "14px Georgia";
  this.ctx.fillStyle = "#f00";
  this.ctx.fillText("x", 105, 0);
  this.ctx.closePath();
  this.ctx.beginPath();
  this.ctx.lineWidth = 1;
  this.ctx.moveTo(0, -100);
  this.ctx.lineTo(0, 100);
  this.ctx.stroke();
  this.ctx.closePath();
  this.ctx.beginPath();
  this.ctx.font = "14px Georgia";
  this.ctx.fillStyle = "#f00";
  this.ctx.fillText("y", 0, 105);
  this.ctx.fill();
  this.ctx.closePath();
}

function drawArc(x, y, r, sAngle, eAngle) {
  this.ctx.beginPath();
  this.ctx.fillStyle = "#fff";
  this.ctx.moveTo(x, y);
  this.ctx.arc(x, y, r, sAngle, eAngle, false);
  this.ctx.fill();
  this.ctx.closePath();
  this.ctx.restore();
}
// const canvas = document.getElementById("myCanvas");
// const this.ctx = canvas.getContext("2d");
// init();
