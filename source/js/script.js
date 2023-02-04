const burger = document.querySelector('.header__button');
const header = document.querySelector('.header');
const inputs = document.querySelectorAll('input[name="phone"]');
const portfolioMenuBtns = document.querySelectorAll('.portfolio__menu-item');
const portfolioContainer = document.querySelector('.portfolio__container');
const portfolioCards = document.querySelectorAll('.portfolio__link');
const popup = document.querySelector('.popup');
const popupClose = document.querySelector('.popup__btn');
const sliderRightBtn = document.querySelector('.popup__control--right');
const sliderleftBtn = document.querySelector('.popup__control--left');
const sliderCounter = document.querySelector('.popup__counter');
const sliderTitle = document.querySelector('.popup__title');
const sliderWrapper = document.querySelector('.popup__content-wrapper');
const navigationBtns = document.querySelectorAll('.navigation__item');
const modalBtn = document.querySelector('.modal-cb__btn');
const modal = document.querySelector('.modal-cb');
const openModal = document.querySelectorAll('.js-modal-btn');

const PHONE_SCHEME = '+7-___-___-__-__';
let currentPos = 3;
let currentValue = '';

openModal.forEach((btn) => {
  btn.addEventListener('click', () => {
    modal.classList.add('js-animated');
    setTimeout(() => {
      modal.classList.remove('modal-cb--closed');
    }, 1);

  });
});

modalBtn.addEventListener('click', () => {
  modal.classList.add('modal-cb--closed');
  setTimeout(() => {
    modal.classList.remove('js-animated');
  }, 900);
});


// кнопка меню бургер
burger.addEventListener('click', () => {
  header.classList.toggle('header--opened');
});
//
// закрытие меню по клику на навигацию
navigationBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    header.classList.remove('header--opened');
  })
});
//
// обработка инпута в форме
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
    if (letter.match(/\D/g)) {
      e.target.value = currentValue;
      setTimeout(() => {
        e.target.selectionStart = currentPos;
        e.target.selectionEnd = currentPos;
      }, 1);
      return;
    }
    if (e.target.value.length < currentValue.length) {
      currentPos++;
      currentPos < 3 ? currentPos = 3 : null;
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
//
// отслеживание позиции для запуска анимации элементов
const observer = new IntersectionObserver(entries => {
  // перебор записей
  entries.forEach(entry => {
    // если элемент появился
    if (entry.isIntersecting) {
      // добавить ему CSS-класс
      const className = (window.screen.width < 770 && entry.target.dataset.animation !== 'upScale')
        ? 'fadeInUp'
        : entry.target.dataset.animation;
      entry.target.classList.add(className);
    }
  });
});
const animated = document.querySelectorAll('.js-animated');
animated.forEach((a) => observer.observe(a));
//
// смена карточек в портфолио
portfolioMenuBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    portfolioContainer.classList.add('portfolio__container--animated');
    setTimeout(() => {
      portfolioContainer.classList.remove('portfolio__container--animated');
    }, 100);
    portfolioMenuBtns.forEach((button) => {
      button.classList.remove('portfolio__menu-item--active');
    });
    e.target.classList.add('portfolio__menu-item--active');
    const index = e.target.dataset.index;
    portfolioCards.forEach((link) => {
      if (index === link.dataset.index) {
        link.parentElement.classList.remove('portfolio__item--hidden');
        link.parentElement.classList.add('animated');
      }
      if (index !== link.dataset.index) {
        if (!link.parentElement.classList.contains('portfolio__item--hidden')) {
          link.parentElement.classList.add('animated');
          link.parentElement.classList.add('portfolio__item--hidden');
        }
      }
      if (index === '0') {
        link.parentElement.classList.remove('portfolio__item--hidden');
      }
      setTimeout(() => {
        link.parentElement.classList.remove('animated');
      }, 100);
    });
  });
});
//
// слайдер
// --кнопка закрытия
popupClose.addEventListener('click', (e) => {
  popup.classList.toggle('hide');
});
// --первая загрузка слайдера
portfolioCards.forEach((card, i) => {
  card.addEventListener('click', (e) => loadSlide(e, i));
});

let currentIndex = 0;

function loadSlide(e, i) {
  const currentImgSrc = e.target.style.backgroundImage.replace('url("', '').replace('")', '');
  const prevImgSrc = portfolioCards[i === 0
    ? portfolioCards.length - 1
    : i - 1].style.backgroundImage.replace('url("', '').replace('")', '');
  const nextImgSrc = portfolioCards[i === portfolioCards.length - 1
    ? 0
    : i + 1].style.backgroundImage.replace('url("', '').replace('")', '');
  const currentImg = document.createElement('img');
  const prevImg = document.createElement('img');
  const nextImg = document.createElement('img');
  currentImg.classList.add('img-curr');
  currentImg.src = currentImgSrc;
  prevImg.src = prevImgSrc;
  prevImg.classList.add('img-prev');
  nextImg.src = nextImgSrc;
  nextImg.classList.add('img-next');
  sliderWrapper.innerHTML = '';
  // currentImg.addEventListener('click', (e) => e.target.classList.toggle('img--scale'));
  sliderWrapper.append(prevImg, currentImg, nextImg);
  currentImg.title = e.target.dataset.alt;
  sliderTitle.innerHTML = e.target.dataset.alt;
  popup.classList.toggle('hide');
  currentIndex = i;
  sliderCounter.innerHTML = `${currentIndex + 1} / ${portfolioCards.length}`;
}
// --кнопки смены слайдов
sliderRightBtn.addEventListener('click', () => changeSlide('right'));
sliderleftBtn.addEventListener('click', () => changeSlide('left'));

function changeSlide(side) {
  const prevImg = document.querySelector('.img-prev');
  const currImg = document.querySelector('.img-curr');
  const nextImg = document.querySelector('.img-next');
  let options = {};
  switch (side) {
    case "right": options = {
      currentClass: 'img-prev',
      toDelete: prevImg,
      toChange: nextImg,
      curInd: 'plus',
      newClass: 'img-next',
      addAction: 'append'
    };
      break;
    case 'left': options = {
      currentClass: 'img-next',
      toDelete: nextImg,
      toChange: prevImg,
      curInd: 'minus',
      newClass: 'img-prev',
      addAction: 'prepend'
    };
      break;
    default: null;
      break;
  }
  currImg.classList.remove('img-curr');
  currImg.classList.add(options.currentClass);
  options.toChange.classList.remove(options.newClass);
  options.toChange.classList.add('img-curr');
  prevImg.parentNode.removeChild(options.toDelete);
  currentIndex = checkIndex(currentIndex, options.curInd);
  const newImg = document.createElement('img');
  newImg.classList.add(options.newClass);
  newImg.src = portfolioCards[checkIndex(currentIndex, options.curInd)].style.backgroundImage.replace('url("', '').replace('")', '');
  sliderTitle.innerHTML = portfolioCards[currentIndex].dataset.alt;
  sliderWrapper.classList.remove('popup__content-wrapper--scale');
  popup.querySelector('.popup__content-wrapper')[options.addAction](newImg);
  sliderCounter.innerHTML = `${currentIndex + 1} / ${portfolioCards.length}`;
}
// --проверка индекса слайда
function checkIndex(index, action) {
  if (action === 'plus') {
    index = index === (portfolioCards.length - 1) ? 0 : index + 1;
  }
  if (action === 'minus') {
    index = index === 0 ? portfolioCards.length - 1 : index - 1;
  }
  return index;
}
sliderWrapper.addEventListener('click', (e) => {
  sliderWrapper.classList.toggle('popup__content-wrapper--scale');
})
//
