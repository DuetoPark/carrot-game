'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpMessage = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');

    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  hide() {
    this.popUp.classList.remove('is-active');
  }

  showWithText(message) {
    this.popUpMessage.innerHTML = message;
    this.popUp.classList.add('is-active');
  }
}
