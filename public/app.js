const chat = document.getElementById("chat");
const btn = document.getElementById("send");

const ws = new WebSocket(`ws://${location.host}`);

let currentSystemMsg = null;

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

ws.onmessage = (e) => {

  const msg = JSON.parse(e.data);

  if (msg.role !== "system") return;

  if (msg.type === "char") {
    streamChar(msg.value);
  }

  if (msg.type === "end") {
    currentSystemMsg = null;
  }
};

btn.onclick = () => {

  render("user", LOREM);

  ws.send(JSON.stringify({
    role: "user",
    text: LOREM
  }));
};


/* ===========================
   STREAMING
=========================== */

function streamChar(char) {

  if (!currentSystemMsg) {
    currentSystemMsg = createMsg("system");
  }

  currentSystemMsg.textContent += char;

  scroll();
}


/* ===========================
   RENDER
=========================== */

function render(role, text) {

  const div = createMsg(role);

  div.textContent += text;

  scroll();
}

function createMsg(role) {

  const div = document.createElement("div");

  div.className = `msg ${role}`;

  div.textContent = `[${role}] `;

  chat.appendChild(div);

  return div;
}

function scroll() {
  chat.scrollTop = chat.scrollHeight;
}