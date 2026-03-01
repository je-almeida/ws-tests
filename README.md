# WebSocket Load Test — Node.js

Projeto de teste de carga para conexões WebSocket simultâneas com Node.js, simulando o comportamento de streaming de uma LLM (estilo ChatGPT).

## Objetivo

Validar quantas conexões WebSocket podem ser abertas em paralelo na mesma página e se o servidor Node.js consegue servir múltiplos streams simultâneos sem bloqueio, usando o event loop e `async/await`.

## Como funciona

```
Cliente (browser)                    Servidor (Node.js + ws)
─────────────────                    ───────────────────────
Abre N conexões WS        ──────►    Aceita cada conexão
Envia { role: "user", id }──────►    Lê o id da conexão
                          ◄──────    Streama "[ws-N] Lorem..." char a char
Renderiza stream em tempo real
Ao receber "end", reenvia a próxima mensagem (loop)
```

## Estrutura

```
io-tests/
├── server.js          # Servidor WebSocket (Express + ws)
└── public/
    ├── index.html
    ├── app.js         # Abre N conexões WS e renderiza os streams
    └── style.css
```

## Configuração

### Número de janelas

Em `public/app.js`:

```js
const qtde_janelas = 9; // qualquer número: 1, 50, 200...
```

### Velocidade do stream (delay por caractere)

Em `server.js`:

```js
const CHAR_DELAY_MS = 40; // 12 = rápido | 40 = médio | 80+ = lento
```

## Como rodar

```bash
npm install
node server.js
```

Acesse `http://localhost:3000`.

## Verificação visual

Cada caixa exibe o prefixo `[ws-N]` produzido pelo servidor, confirmando que aquela caixa está recebendo de sua própria conexão WebSocket e não de uma resposta compartilhada.
