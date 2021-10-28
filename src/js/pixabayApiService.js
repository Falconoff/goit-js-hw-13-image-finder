export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    console.log(this);
    const API_KEY = '24083416-1e00017d670d2bdb130fa2702';
    const URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';

    fetch(`${URL}q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`)
      .then(r => r.json())
      .then(this.incrementPage());
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
