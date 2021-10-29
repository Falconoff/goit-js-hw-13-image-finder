import debounce from 'lodash.debounce';
import PixabayApiService from './apiService.js';
import cardTemplate from '../templates/cardTmpl.hbs';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('input', debounce(onSearch, 1000));

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  pixabayApiService.query = e.target.value;

  if (pixabayApiService.query === '') {
    clearGallery();
    return alert('Bad query!');
  }

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
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(imgs));

  refs.loadMoreBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
