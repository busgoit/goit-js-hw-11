import './css/styles.css';

import ImgApiService from './js/api-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
};

refs.searchForm.addEventListener('submit', onSearch);

const imgApiService = new ImgApiService();

function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value;
  imgApiService.searchQuery = searchQuery;

  fetchImg();
}

function fetchImg() {
  imgApiService
    .fetchImg()
    .then(function ({ data: { hits } }) {
      // обработка успешного запроса
      console.log(hits);
    })
    .catch(function (error) {
      // обработка ошибки
      console.log(error);
    });
}
