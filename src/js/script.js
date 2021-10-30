import debounce from 'lodash.debounce';
import PixabayApiService from './apiService.js';
import cardTemplate from '../templates/cardTmpl.hbs';
// ========= notify ===============
import { error } from '@pnotify/core'; // from Creating Notices
// import * as PNotifyDesktop from '@pnotify/desktop'; // from Desktop Module
import '@pnotify/core/dist/BrightTheme.css'; // from Styles - Bright Theme
import '@pnotify/core/dist/PNotify.css'; // from Installation React

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  toDownBtn: document.getElementById('to-down'),
  toUpBtn: document.getElementById('to-up'),
};

//=========== scrollIntoView() experiments ===========
// const toDownBtn = document.getElementById('to-down');
// const toUpBtn = document.getElementById('to-up');
refs.toDownBtn.addEventListener('click', () => {
  console.log('click DOWN');
  // toUp.scrollIntoView({ block: 'end', behavior: 'smooth' });
  doSmoothScroll(refs.toUpBtn, 'end');
});
refs.toUpBtn.addEventListener('click', () => {
  console.log('click UP');
  // toDown.scrollIntoView({ block: 'start', behavior: 'smooth' });
  doSmoothScroll(refs.toDownBtn, 'start');
});

//====================================================

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('input', debounce(onSearch, 1000));

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  pixabayApiService.query = e.target.value;

  if (pixabayApiService.query === '') {
    clearGallery();
    refs.loadMoreBtn.setAttribute('disabled', 'disabled');
    showErrorMessage('Please, enter your request');

    return;
  }

  refs.loadMoreBtn.setAttribute('disabled', 'disabled');
  pixabayApiService.resetPage();
  pixabayApiService.fetchImages().then(images => {
    clearGallery();
    appendImgCards(images);
  });
}

function onLoadMore() {
  // console.log('click on loadMoreBtn');
  pixabayApiService.fetchImages().then(appendImgCards);
}

function appendImgCards(imgs) {
  if (imgs.length === 0) {
    showErrorMessage('No matches found');
    return;
  }

  refs.loadMoreBtn.removeAttribute('disabled');
  // console.log('img url:', imgs[0].webformatURL);
  let isFirstQuery = true;
  if (refs.gallery.innerHTML !== '') isFirstQuery = false;

  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(imgs));

  // console.log('firstImg ====', firstImg);

  const firstImg = document.querySelector(`[src="${imgs[0].webformatURL}"]`);
  if (!isFirstQuery) {
    doSmoothScroll(firstImg, 'start');
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// ===== SCROLL ============
function doSmoothScroll(elem, position) {
  elem.scrollIntoView({
    behavior: 'smooth',
    block: position,
  });
}

// ======== Notify function ==============
function showErrorMessage(text) {
  error({
    text: text,
    type: 'error',
    delay: 2000,
    maxTextHeight: null,
    width: '400px',
    dir1: 'down',
    firstpos1: 25,
    stack: window.stackTopCenter,
  });
}
