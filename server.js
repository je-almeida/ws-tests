import express from "express";
import http from "http";
import { WebSocketServer } from "ws";


/* ─── CONFIG ─────────────────────────────────────────────────────────────── */

const CONFIG = {
  port: 3000,
  charDelayMs: 80,
  response: "Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(6),
};


/* ─── STRATEGY: geração de texto ─────────────────────────────────────────── */
// Troque por OpenAIStreamStrategy, AnthropicStreamStrategy, etc.

class LoremStreamStrategy {
  constructor(text) {
    this._text = text;
  }

  /** @yields {string} um caractere por vez */
  *generate(prefix) {
    for (const char of prefix + this._text) {
      yield char;
    }
  }
}


/* ─── FACTORY: mensagens do protocolo ────────────────────────────────────── */

const MessageFactory = {
  char: (value) => JSON.stringify({ type: "char", value }),
  end:  ()      => JSON.stringify({ type: "end" }),
};


/* ─── CONNECTION HANDLER (SRP + Observer) ────────────────────────────────── */

class ConnectionHandler {
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


/* ─── BOOTSTRAP ──────────────────────────────────────────────────────────── */

function createServer(config) {
  const app      = express();
  const server   = http.createServer(app);
  const wss      = new WebSocketServer({ server });
  const strategy = new LoremStreamStrategy(config.response);

  app.use(express.static("public"));

  wss.on("connection", (ws) => new ConnectionHandler(ws, strategy, config));

  server.listen(config.port, () => {
    console.log(`http://localhost:${config.port}`);
  });
}

createServer(CONFIG);


/* ─── UTIL ───────────────────────────────────────────────────────────────── */

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}