function handleTabChange(value) {
  tab = value;
  eval(value + "()");
}
function clock() {
  let str = `
      
  `;
  configureBox.innerHTML = str;
  startClock();
}
function cheek() {
  let str = `
    <div class="cfg-item">
        <label>选择我方 </label>
        <select id="side"> 
            <option value ="1" selected>白子</option>
            <option value ="2">黑子</option>
        </select>
    </div>
    <div class="cfg-item">
        <label>等待时间 </label>
        <input
            type="text"
            name="wait"
            id="wait"
            value="3"
        />
    </div>
    <div class="cfg-item">
          <label>宽 </label>
          <input
              type="text"
              name="width"
              id="width"
              value="600"
          />
      </div>
      <div class="cfg-item">
          <label>高 </label>
          <input
              type="text"
              name="height"
              id="height"
              value="600"
          />
      </div>
    <div class="cfg-item">
        <button onclick="startCheek()">开始</button>
    </div>
`;
  configureBox.innerHTML = str;
  startCheek();
}
function snake() {
  let str = `
      <div class="cfg-item">
          <label>等级 </label>
          <select id="level"> 
              <option value ="1" selected>初级</option>
              <option value ="2">中级</option>
              <option value ="3">高级</option>
          </select>
      </div>
      <div class="cfg-item">
          <label>宽 </label>
          <input
              type="text"
              name="width"
              id="width"
              value="600"
          />
      </div>
      <div class="cfg-item">
          <label>高 </label>
          <input
              type="text"
              name="height"
              id="height"
              value="600"
          />
      </div>
      <div class="cfg-item">
          <button onclick="startSnake()">开始</button>
      </div>
  `;
  configureBox.innerHTML = str;
  startSnake();
}
function star() {
  let str = `
      <div class="cfg-item">
          <label>间隔 </label>
          <input
              type="text"
              id="span"
              value="50"
          />
      </div>
      <div class="cfg-item">
          <label>星星数量 </label>
          <input
              type="text"
              id="number"
              value="100"
          />
      </div>
      <div class="cfg-item">
          <label>宽 </label>
          <input
              type="text"
              name="width"
              id="width"
              value="1200"
          />
      </div>
      <div class="cfg-item">
          <label>高 </label>
          <input
              type="text"
              name="height"
              id="height"
              value="500"
          />
      </div>
      <div class="cfg-item">
          <button onclick="startStar()">开始</button>
      </div>
  `;
  configureBox.innerHTML = str;
  startStar();
}
function startCheek() {
  let side = Number(document.getElementById("side").value);
  let wait = Number(document.getElementById("wait").value);
  let width = Number(document.getElementById("width").value);
  let height = Number(document.getElementById("height").value);
  renderTab(tab, {
    player: side,
    wait: wait,
    width: width,
    height: height,
  });
}
function startSnake() {
  let level = Number(document.getElementById("level").value);
  let width = Number(document.getElementById("width").value);
  let height = Number(document.getElementById("width").value);
  renderTab(tab, {
    level: level,
    width: width,
    height: height,
  });
}
function startClock() {
  renderTab(tab);
}
function startStar() {
  let span = Number(document.getElementById("span").value);
  let number = Number(document.getElementById("number").value);
  let width = Number(document.getElementById("width").value);
  let height = Number(document.getElementById("height").value);
  renderTab(tab, {
    span: span,
    number: number,
    width: width,
    height: height,
  });
}
function renderTab(tab, config = {}) {
  let canvasBox = document.getElementById("canvas-box");
  let canvasEl = `<canvas id="${tab}"></canvas>`;
  canvasBox.innerHTML = canvasEl;
  tabObj = tab.charAt(0).toUpperCase() + tab.slice(1);
  let obj = {
    width: 400,
    height: 400,
    id: tab,
    ...config,
  };
  eval("new " + tabObj + "(obj)");
}
let tab = "cheek";
let configureBox = document.getElementById("configure");
handleTabChange(tab);
