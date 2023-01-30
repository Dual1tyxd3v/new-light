const burger = document.querySelector('.header__button');
const header = document.querySelector('.header');

burger.addEventListener('click', () => {
  header.classList.toggle('header--opened');
});
