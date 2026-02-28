import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static("public"));

const RESPONSE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(6);

wss.on("connection", (ws) => {

  ws.on("message", async (raw) => {

    let msg;

    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.role !== "user") return;

    const prefix = `[ws-${msg.id ?? 0}] `;
    const fullResponse = prefix + RESPONSE;

    for (const char of fullResponse) {

      if (ws.readyState !== ws.OPEN) return;

      ws.send(JSON.stringify({
        type: "char",
        value: char
      }));

      await sleep(12);
    }

    ws.send(JSON.stringify({
      type: "end"
    }));
  });
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

server.listen(3000, () => {
  console.log("http://localhost:3000");
});