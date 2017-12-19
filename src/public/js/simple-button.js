export class SimpleButton {
  constructor(id, listener) {
    // if it's already an elm
    if (typeof id === 'object') {
      this.elm = id;
    } else {
      this.elm = document.getElementById(id);
    }

    if (this.elm && typeof listener === 'function') {
      this.elm.addEventListener('click', listener);
    }
  }

  static createAll(elms, listener) {
    let buttons = [];

    for (let elm of elms) {
      buttons.push(new SimpleButton(elm, listener));
    }

    return buttons;
  }
}
