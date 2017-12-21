export class Modal {
  constructor(id) {
    this.visible = false;
    this.elm = document.getElementById(id);
    this.bgElm = document.getElementById('modal-overlay');

    if (!this.elm || !this.bgElm) return;
    
    this.hide = this.hide.bind(this);
    this.bgElm.addEventListener('click', this.hide);
  }

  show() {
    this.elm.classList.add('modal-show');
    this.bgElm.classList.add('modal-show');
  }

  hide() {
    this.elm.classList.remove('modal-show');
    this.bgElm.classList.remove('modal-show');
  }

  fillValues(dataset) {
    let obj = Object.assign({}, dataset);
    for (let key in obj) {
      let value = obj[key];
      this.elm.querySelector(`[name=${key}`).value = value;
    }
  }

  clearValues() {
    Array.from(this.elm.querySelectorAll('input'))
      .concat(Array.from(this.elm.querySelectorAll('textarea')))
      .concat(Array.from(this.elm.querySelectorAll('select')))
      .forEach((input) => input.value = null);
  }
}
