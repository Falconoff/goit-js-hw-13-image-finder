import debounce from 'lodash.debounce';
import PixabayApiService from './apiService.js';
import cardTemplate from '../templates/cardTmpl.hbs';
// ========= notify ===============
import { error } from '@pnotify/core'; // from Creating Notices
import '@pnotify/core/dist/BrightTheme.css'; // from Styles - Bright Theme
import '@pnotify/core/dist/PNotify.css'; // from Installation React

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

  if (pixabayApiService.query === '') {
    clearGallery();
    makeLoadMoreBtnDisabled();
    showErrorMessage('Please, enter your request');
    return;
  }

  makeLoadMoreBtnDisabled();
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
  });
}

// ====== enable/disable "Load more" Button funcs ======
function makeLoadMoreBtnDisabled() {
  refs.loadMoreBtn.setAttribute('disabled', 'disabled');
}

function makeLoadMoreBtnEnabled() {
  refs.loadMoreBtn.removeAttribute('disabled');
}

// ================== basicLightbox ======================================
import * as basicLightbox from 'basiclightbox';
const testBtn = document.querySelector('.test-show-img');

testBtn.addEventListener('click', () => {
  console.log('click testBtn');
  instance.show();
  // setTimeout(() => instance.close(), 3000);
});

const instance = basicLightbox.create(
  `
    <div class="modal">
      <img width="1200" height="auto" src="https://pixabay.com/get/gb593b614feeb594ea64494ffec5e849972aa3fceb042ee5bfb5a00316768e78a7823bfca0b47a495687eaedd8cc37e00ac8a84562511021ccf2ae5e6c70aabc9_1280.jpg">
    </div>
  `,
);

// =========== click on card ==================
refs.gallery.addEventListener('click', onShowBigImg);

function onShowBigImg(evt) {
  evt.preventDefault();
  // console.log('currenttarget:', evt.currentTarget);
  // console.log('target:', evt.target);

  if (evt.target.nodeName !== 'IMG') {
    console.log("it's not an img!");
    return;
  }
  console.log("it's an img !!!!)))");
  let link = evt.target.dataset.link;
  console.log('target link:', link);
  basicLightbox.create(`<img width="1200" height="auto" src="${link}">`).show();
}
