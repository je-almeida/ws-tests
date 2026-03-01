/* ─── CONFIG ─────────────────────────────────────────────────────────────── */

const CONFIG = {
  qtde_janelas:     9,    // qualquer número: 1, 9, 50, 200...
  lorem:            "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
  reconnectDelayMs: 200,
};


/* ─── FACTORY: mensagens do protocolo ────────────────────────────────────── */

const MessageFactory = {
  user: (id, text) => JSON.stringify({ role: "user", id, text }),
};


/* ─── RENDERER (SRP) ─────────────────────────────────────────────────────── */
// Responsabilidade única: manipular o DOM de uma caixa de chat.

class ChatRenderer {
  constructor(box) {
    this._box    = box;
    this._buffer = null;
  }

  renderUser(text) {
    const div = this._createMsg("user");
    div.textContent += text;
    this._scroll();
  }

  appendChar(char) {
    if (!this._buffer) this._buffer = this._createMsg("system");
    this._buffer.textContent += char;
    this._scroll();
  }

  endStream() {
    this._buffer = null;
  }

  _createMsg(role) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = `[${role}] `;
    this._box.appendChild(div);
    return div;
  }

  _scroll() {
    this._box.scrollTop = this._box.scrollHeight;
  }
}


/* ─── SOCKET HANDLER (Observer) ──────────────────────────────────────────── */
// Observa eventos do WebSocket e delega ao ChatRenderer.

class SocketHandler {
  constructor(id, renderer, config) {
    this._id       = id;
    this._renderer = renderer;
    this._config   = config;
    this._connect();
  }

  _connect() {
    this._ws           = new WebSocket(`ws://${location.host}`);
    this._ws.onopen    = ()  => this._send();
    this._ws.onmessage = (e) => this._onMessage(e);
    this._ws.onerror   = ()  => this._renderer.renderUser("ERRO");
  }

  _send() {
    this._renderer.renderUser(this._config.lorem);
    this._ws.send(MessageFactory.user(this._id, this._config.lorem));
  }

  _onMessage(e) {
    const msg = JSON.parse(e.data);

    if (msg.type === "char") this._renderer.appendChar(msg.value);

    if (msg.type === "end") {
      this._renderer.endStream();
      setTimeout(() => this._send(), this._config.reconnectDelayMs);
    }
  }
}


/* ─── GRID FACTORY (Factory) ─────────────────────────────────────────────── */
// Cria N boxes no container e instancia um SocketHandler para cada um.

class GridFactory {
  constructor(container, config) {
    this._container = container;
    this._config    = config;
  }

  build() {
    for (let i = 0; i < this._config.qtde_janelas; i++) {
      const box      = this._createBox(i);
      const renderer = new ChatRenderer(box);
      new SocketHandler(i, renderer, this._config);
    }
  }

  _createBox(id) {
    const box     = document.createElement("div");
    box.className = "box";
    box.id        = "box-" + id;
    this._container.appendChild(box);
    return box;
  }
}


/* ─── BOOTSTRAP ──────────────────────────────────────────────────────────── */

document.getElementById("titulo").textContent =
  `WebSocket Streaming (${CONFIG.qtde_janelas} Conexões)`;

new GridFactory(document.getElementById("grid"), CONFIG).build();
