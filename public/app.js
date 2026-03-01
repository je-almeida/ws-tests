/* CONFIG */
const qtde_janelas = 90; // qualquer número, ex: 1, 9, 50, 200

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

const grid = document.getElementById("grid");

document.getElementById("titulo").textContent =
  `WebSocket Streaming (${qtde_janelas} Conexões)`;

const sockets = [];
const buffers = [];


/* INIT GRID */

for (let i = 0; i < qtde_janelas; i++) {

  const box = document.createElement("div");
  box.className = "box";
  box.id = "box-" + i;

  grid.appendChild(box);
  initSocket(i, box);
}


/* SOCKET */

function initSocket(id, box) {

  const ws = new WebSocket(`ws://${location.host}`);

  sockets[id] = ws;
  buffers[id] = null;

  ws.onopen = () => {
    send(ws, id);
  };

  ws.onmessage = (e) => {

    const msg = JSON.parse(e.data);

    if (msg.type === "char") {
      streamChar(id, box, msg.value);
    }

    if (msg.type === "end") {
      buffers[id] = null;

      setTimeout(() => {
        send(ws, id);
      }, 200);
    }
  };

  ws.onerror = () => {
    box.textContent = "ERRO";
  };
}


/* SEND */

function send(ws, id) {

  render(id, "user", LOREM);

  ws.send(JSON.stringify({
    role: "user",
    id: id,
    text: LOREM
  }));
}


/* STREAM */

function streamChar(id, box, char) {

  if (!buffers[id]) {
    buffers[id] = createMsg(box, "system");
  }

  buffers[id].textContent += char;

  scroll(box);
}


/* RENDER */

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