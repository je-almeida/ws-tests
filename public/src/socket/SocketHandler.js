import { MessageFactory } from "../factories/MessageFactory.js";

export class SocketHandler {
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
