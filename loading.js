class Loading {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "loading";
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.translate(width / 2, height / 2);
    document.getElementById("canvas-box").appendChild(this.canvas);
    this.canvas.style = "display:none";
    this.flag = true;
    this.timer = null;
  }

  startLoading(text = "等待对手下棋中...") {
    this.canvas.style = "display:inline-block";
    // if (!this.flag) return;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "14px Georgia";
    this.ctx.fillStyle = "#409eff";
    this.ctx.fillText(text, 0, 0);
    // 画一个短横线
    this.ctx.save();

    let j = 0;
    this.timer = setInterval(() => {
      this.ctx.translate(0, 30);
      this.ctx.clearRect(-15, -15, 30, 30);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(-15, -15, 30, 30);
      this.ctx.rotate((j * 30 * Math.PI) / 180);
      for (let i = 0; i < 12; i++) {
        let alpha = 0.9 - i * 0.07;
        this.ctx.strokeStyle = `rgba(64, 158, 255,${alpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.rotate((30 * Math.PI) / 180);
        //   drawSeries1(this.ctx, "x" + i, "y" + i);
        this.ctx.beginPath();
        this.ctx.moveTo(3, 0);
        this.ctx.lineTo(10, 0);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      this.ctx.restore();
      this.ctx.save();
      j++;
    }, 100);
  }
  stopLoading() {
    this.canvas.style = "display:none";
    this.ctx.clearRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    clearInterval(this.timer);
  }
}
function drawSeries1(context, xT, yT) {
  console.log(xT);
  context.strokeStyle = "#000";
  context.beginPath();
  context.lineWidth = 1;
  context.moveTo(-100, 0);
  context.lineTo(100, 0);
  context.stroke();
  context.closePath();
  context.beginPath();
  context.font = "16px Georgia";
  context.fillStyle = "#fff";
  context.fillText(xT, 120, 0);
  context.closePath();
  //   context.beginPath();
  //   context.lineWidth = 1;
  //   context.moveTo(0, -100);
  //   context.lineTo(0, 100);
  //   context.stroke();
  //   context.closePath();
  //   context.beginPath();
  //   context.font = "14px Georgia";
  //   context.fillStyle = "#f00";
  //   context.fillText(yT, 0, 105);
  //   context.fill();
  //   context.closePath();
}
