import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ImgApiService from './js/api-service';
import photoCardTpl from './templates/photoCardTpl.hbs';
import LoadMoreBtn from './js/load-more-btn';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imgApiService = new ImgApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const appendImgTpl = ({ hits }) => {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(hits));
};

const checkMoreImg = ({ data }) => {
  const isNoImgData = data.totalHits === 0;
  const isImgData = data.totalHits > 0;
  const isLessImgThenPerPage = data.hits.length < imgApiService.perPage && data.totalHits !== 0;

  if (isNoImgData) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreBtn.hide();
  }

  if (isImgData) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  if (isLessImgThenPerPage) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
  }

  return data;
};

const fetchImg = () => {
  imgApiService
    .fetchImg()
    .then(checkMoreImg)
    .then(appendImgTpl)
    .catch(function (error) {
      console.log(error);
      Notify.failure(`${error}`);
    })
    .finally(() => {
      lightbox.refresh();
    });

  loadMoreBtn.enable();
};

const clearImgPage = () => {
  refs.gallery.innerHTML = '';
};

const onSearch = event => {
  event.preventDefault();
  clearImgPage();

  const newSearchQuery = event.currentTarget.elements.searchQuery.value;

  if (newSearchQuery.trim() === '') {
    return Notify.warning('Вы ввели пустой запрос! Введите правильный поисковый запрос!');
  }

  imgApiService.query = newSearchQuery;

  loadMoreBtn.show();

  fetchImg();
};

const onLoadMore = () => {
  imgApiService.incrementPage();
  fetchImg();
};

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
