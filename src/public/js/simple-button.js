export class SimpleButton {
  constructor(id, listener) {
    this.elm = document.getElementById(id);

    if (this.elm && typeof listener === 'function') {
      this.elm.addEventListener('click', listener);
    }
  }
}
