import { ChatRenderer } from "../renderer/ChatRenderer.js";
import { SocketHandler } from "../socket/SocketHandler.js";

export class GridFactory {
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
