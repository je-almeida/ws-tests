import { MessageFactory } from "../factories/MessageFactory.js";
import { sleep }          from "../util/sleep.js";

export class ConnectionHandler {
  constructor(ws, strategy, config) {
    this._ws       = ws;
    this._strategy = strategy;
    this._config   = config;

    this._ws.on("message", (raw) => this._onMessage(raw));
  }

  _onMessage(raw) {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.role !== "user") return;

    this._stream(`[ws-${msg.id ?? 0}] `);
  }

  async _stream(prefix) {
    for (const char of this._strategy.generate(prefix)) {
      if (this._ws.readyState !== this._ws.OPEN) return;
      this._ws.send(MessageFactory.char(char));
      await sleep(this._config.charDelayMs);
    }
    this._ws.send(MessageFactory.end());
  }
}
