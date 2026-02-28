/* CONFIG */
const qtde_janelas = 9; // 1..9

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

const grid = document.getElementById("grid");
const btn = document.getElementById("send");

const sockets = [];
const systemBuffers = [];


/* ==========================
   INIT GRID
========================== */

for (let i = 0; i < 9; i++) {

  const box = document.createElement("div");
  box.className = "box";
  box.id = "box-" + i;

  grid.appendChild(box);

  if (i < qtde_janelas) {
    initSocket(i, box);
  } else {
    box.textContent = "INATIVO";
  }
}


/* ==========================
   SOCKET
========================== */

function initSocket(id, box) {

  const ws = new WebSocket(`ws://${location.host}`);

  sockets[id] = ws;
  systemBuffers[id] = null;

  ws.onmessage = (e) => {

    const msg = JSON.parse(e.data);

    if (msg.role !== "system") return;

    if (msg.type === "char") {
      streamChar(id, box, msg.value);
    }

    if (msg.type === "end") {
      systemBuffers[id] = null;
      autoSend(ws, box);
    }
  };

  ws.onerror = () => {
    box.textContent = "ERRO";
  };
}


/* ==========================
   SEND
========================== */

btn.onclick = () => {

  sockets.forEach((ws, i) => {

    if (ws?.readyState === WebSocket.OPEN) {
      send(ws, i);
    }
  });
};

function send(ws, id) {

  render(id, "user", LOREM);

  ws.send(JSON.stringify({
    role: "user",
    text: LOREM
  }));
}

function autoSend(ws, box) {

  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      send(ws);
    }
  }, 300);
}


/* ==========================
   STREAMING
========================== */

function streamChar(id, box, char) {

  if (!systemBuffers[id]) {
    systemBuffers[id] = createMsg(box, "system");
  }

  systemBuffers[id].textContent += char;

  scroll(box);
}


/* ==========================
   RENDER
========================== */

function render(id, role, text) {

  const box = document.getElementById("box-" + id);

  const div = createMsg(box, role);

  div.textContent += text;

  scroll(box);
}

function createMsg(box, role) {

  const div = document.createElement("div");

  div.className = `msg ${role}`;
  div.textContent = `[${role}] `;

  box.appendChild(div);

  return div;
}

function scroll(box) {
  box.scrollTop = box.scrollHeight;
}