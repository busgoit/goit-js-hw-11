import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ImgApiService from './js/api-service';
import photoCardTpl from './templates/photoCardTpl.hbs';
import LoadMoreBtn from './js/load-more-btn';

// import 'simplelightbox/dist/simple-lightbox.min.css';
// import SimpleLightbox from 'simplelightbox';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imgApiService = new ImgApiService();

const fetchImg = () => {
  loadMoreBtn.disable();
  return imgApiService.fetchImg();
};

const appendImgTpl = ({ data: { hits } }) => {
  // photoCardTpl(hits);
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(hits));
  // console.log(hits);
  // console.log(photoCardTpl(hits));
};

const appendImgMarkup = () => {
  fetchImg()
    .then(appendImgTpl)
    .catch(function (error) {
      console.log(error);
    });
  loadMoreBtn.enable();
};

const onSearch = event => {
  event.preventDefault();

  const newSearchQuery = event.currentTarget.elements.searchQuery.value;

  if (newSearchQuery.trim() === '') {
    return Notify.warning('Вы ввели пустой запрос! Введите правильный поисковый запрос!');
  }

  imgApiService.query = newSearchQuery;

  loadMoreBtn.show();
  fetchImg();
  appendImgMarkup();
};

refs.searchForm.addEventListener('submit', onSearch);
