export class ChatRenderer {
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
