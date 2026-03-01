export class LoremStreamStrategy {
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
