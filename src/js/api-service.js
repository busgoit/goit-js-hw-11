const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '29567452-13c0ef8ee2b32c583ed3e8ed6';
const SEARCH_FILTER = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 10;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  fetchImg() {
    return axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${SEARCH_FILTER}&per_page=${this.perPage}&page=${this.page}`
    );
  }
}
