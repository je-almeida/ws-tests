import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static("public"));

const RESPONSE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(5);

wss.on("connection", (ws) => {

  ws.on("message", async (raw) => {

    const msg = JSON.parse(raw.toString());

    if (msg.role !== "user") return;

    for (const char of RESPONSE) {

      if (ws.readyState !== ws.OPEN) return;

      ws.send(JSON.stringify({
        role: "system",
        type: "char",
        value: char
      }));

      await sleep(15);
    }

    ws.send(JSON.stringify({
      role: "system",
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