const burger = document.querySelector('.header__button');
const header = document.querySelector('.header');
const inputs = document.querySelectorAll('input[type="tel"');

const PHONE_SCHEME = '+7-___-___-__-__';
let currentPos = 3;
let currentValue = '';

burger.addEventListener('click', () => {
  header.classList.toggle('header--opened');
});

inputs.forEach((input) => {
  input.addEventListener('focus', (e) => {
    if (e.target.value.length === 0) {
      e.target.value = PHONE_SCHEME;
      setTimeout(() => {
        e.target.selectionStart = 3;
        e.target.selectionEnd = 3;
      }, 1);
    }
    currentValue = e.target.value;
  });

  input.addEventListener('click', (e) => {
    if (e.target.value === PHONE_SCHEME) return;
    currentPos = getCursorPosition(e.target);
  });

  input.addEventListener('input', (e) => {
    currentPos = e.target.value === PHONE_SCHEME
      ? 3 : getCursorPosition(e.target) - 1;
    const letter = e.target.value[currentPos];
    if (e.target.value.length < currentValue.length) {
      currentPos++;
      currentPos < 3 ? currentPos = 3: null;
      if (currentValue[currentPos] === '-') currentPos--;
      currentValue = (currentValue.slice(0, currentPos) + '_' + currentValue.slice(currentPos + 1)).slice(0, 16);
      e.target.value = currentValue;
      setTimeout(() => {
        e.target.selectionStart = currentPos;
        e.target.selectionEnd = currentPos;
      }, 1);
      return;
    }
    if (currentValue[currentPos] === '-') currentPos++;
    currentValue = (currentValue.slice(0, currentPos) + letter + currentValue.slice(currentPos + 1)).slice(0, 16);
    currentPos === 16 ? null : currentPos++;
    setTimeout(() => {
      e.target.selectionStart = currentPos;
      e.target.selectionEnd = currentPos;
    }, 1);
    e.target.value = currentValue;
  });

  input.addEventListener('blur', (e) => {
    e.target.value = e.target.value === PHONE_SCHEME
      ? ''
      : e.target.value;
  });
});

function getCursorPosition(ctrl) {
  let CaretPos = 0;
  if (document.selection) {
    ctrl.focus();
    const Sel = document.selection.createRange();
    Sel.moveStart('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
    CaretPos = ctrl.selectionStart;
  }
  return CaretPos;
}

