import { CONFIG }      from "./src/config.js";
import { GridFactory } from "./src/grid/GridFactory.js";

document.getElementById("titulo").textContent =
  `WebSocket Streaming (${CONFIG.qtde_janelas} Conexões)`;

new GridFactory(document.getElementById("grid"), CONFIG).build();
