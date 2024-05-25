import debounce from 'lodash.debounce';
import PixabayApiService from './apiService.js';
import cardTemplate from '../templates/cardTmpl.hbs';
// ========= notify ===============
import { error } from '@pnotify/core'; // from Creating Notices
import '@pnotify/core/dist/BrightTheme.css'; // from Styles - Bright Theme
import '@pnotify/core/dist/PNotify.css'; // from Installation React
// ================== basicLightbox ======================================
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  toDownBtn: document.getElementById('to-down'),
  toUpBtn: document.getElementById('to-up'),
};

//=========== Up/Down buttons  ===========
refs.toDownBtn.addEventListener('click', () => {
  doSmoothScroll(refs.toUpBtn, 'end');
});

refs.toUpBtn.addEventListener('click', () => {
  doSmoothScroll(refs.toDownBtn, 'start');
});
//====================================================

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('input', debounce(onSearch, 1000));

refs.loadMoreBtn.addEventListener('click', onFetchImages);

function onSearch(e) {
  pixabayApiService.query = e.target.value;
  makeLoadMoreBtnDisabled();

  if (pixabayApiService.query === '') {
    clearGallery();
    showErrorMessage('Please, enter your request');
    return;
  }

  clearGallery();
  pixabayApiService.resetPage();
  onFetchImages();
}

async function onFetchImages() {
  const imagesArr = await pixabayApiService.fetchImages();
  appendAndScroll(imagesArr);
}

function appendAndScroll(imgsArray) {
  if (imgsArray.length === 0) {
    showErrorMessage('No matches found');
    return;
  }

  let isFirstQuery = true;
  if (refs.gallery.innerHTML !== '') isFirstQuery = false;

  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(imgsArray));

  const firstImg = document.querySelector(`[src="${imgsArray[0].webformatURL}"]`);
  if (!isFirstQuery) {
    doSmoothScroll(firstImg, 'start');
  }
  makeLoadMoreBtnEnabled();
}

// delete all cards from Gallery
function clearGallery() {
  refs.gallery.innerHTML = '';
}

// ===== smooth scroll ============
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
  });
}

// ====== enable/disable "Load more" Button funcs ======
function makeLoadMoreBtnDisabled() {
  refs.loadMoreBtn.setAttribute('disabled', 'disabled');
}

function makeLoadMoreBtnEnabled() {
  refs.loadMoreBtn.removeAttribute('disabled');
}

// ---- click on card (basicLightbox modal) -----
refs.gallery.addEventListener('click', onShowBigImg);

function onShowBigImg(evt) {
  evt.preventDefault();

  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  let link = evt.target.dataset.link;
  basicLightbox.create(`<img class="big-img" src="${link}">`).show();
}
