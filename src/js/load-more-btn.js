export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};

    refs.button = document.querySelector(selector);
    refs.spinner = refs.button.querySelector('.spinner');
    refs.label = refs.button.querySelector('.label');

    return refs;
  }

  enable() {
    this.refs.spinner.classList.add('is-hidden');
    this.refs.label.classList.remove('is-hidden');
  }

  disable() {
    this.refs.spinner.classList.remove('is-hidden');
    this.refs.label.classList.add('is-hidden');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
