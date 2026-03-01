import express         from "express";
import http            from "http";
import { WebSocketServer } from "ws";

import { CONFIG }              from "./src/config.js";
import { LoremStreamStrategy } from "./src/strategies/LoremStreamStrategy.js";
import { ConnectionHandler }   from "./src/handlers/ConnectionHandler.js";

const app      = express();
const server   = http.createServer(app);
const wss      = new WebSocketServer({ server });
const strategy = new LoremStreamStrategy(CONFIG.response);

app.use(express.static("public"));

wss.on("connection", (ws) => new ConnectionHandler(ws, strategy, CONFIG));

server.listen(CONFIG.port, () => {
  console.log(`http://localhost:${CONFIG.port}`);
});