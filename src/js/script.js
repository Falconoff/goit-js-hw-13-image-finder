import debounce from 'lodash.debounce';
import PixabayApiService from './pixabayApiService';
import cardTemplate from '../templates/cardTmpl.hbs';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const pixabayApiService = new PixabayApiService();
// const API_KEY = '24083416-1e00017d670d2bdb130fa2702';
// const URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';

refs.searchForm.addEventListener('input', debounce(onSearch, 1000));

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  // console.log('qwerty');
  // let searchQuery = e.target.value;
  // console.log('searchQuery:', searchQuery);
  // fetch(`${URL}q=${searchQuery}&page=1&per_page=12&key=${API_KEY}`)
  //   .then(r => r.json())
  //   .then(console.log);

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
  console.log('click on loadMoreBtn');
  pixabayApiService.fetchImages().then(appendImgCards);
}

function appendImgCards(imgs) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(imgs));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
