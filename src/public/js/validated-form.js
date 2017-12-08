export class ValidatedForm {
  constructor(id, formData, errors) {
    this.elm = document.getElementById(id);
    if (!this.elm) return;

    this.formData = formData;
    this.errors = errors;
    this.showErrors = this.showErrors.bind(this);
    this.showErrors();
  }

  showErrors() {
    for(let [name, value] of Object.entries(this.formData)) {
      if (typeof value !== 'string') continue;
      let input = this.elm.querySelectorAll(`[name=${name}]`)[0];
      if (!input) continue;
      input.value = value;
    }

    for (let [name, value] of Object.entries(this.errors)) {
      if (typeof value !== 'string') continue;
      let input = this.elm.querySelectorAll(`[name=${name}]`)[0];
      if (!input) continue;
      let parent = input.parentElement;
      parent.classList.add('error');
      parent.getElementsByClassName('error-icon')[0].setAttribute('data-before', value);
    }
  }
}
