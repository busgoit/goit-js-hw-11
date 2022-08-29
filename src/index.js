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
  // showCounter: false,
  // scrollZoom: false,
  // showCaptions: true,
  // captionType: 'data',
  // captionsData: 'caption',
  // sourceAttr: 'data-href',
  // captionPosition: 'bottom',
  // captionDelay: 250,
});

// console.log(lightbox);

const appendImgTpl = ({ hits }) => {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(hits));
};

const checkMoreImg = ({ data }) => {
  const isImgData = data.hits === {};
  const isMoreImg = data.hits.length === imgApiService.perPage;

  if (isImgData) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreBtn.hide();
  }

  if (!isMoreImg) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
  }

  Notify.success(`Hooray! We found ${data.totalHits} images.`);

  return data;
};

const fetchImg = () => {
  imgApiService
    .fetchImg()
    .then(checkMoreImg)
    .then(appendImgTpl)
    .catch(function (error) {
      console.log(error);
    })
    .finally(
      () => {
        lightbox.refresh();
      }
      // console.log('finaly');
      // console.log(lightbox);
    );

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
  // lightbox.refresh();

  // console.log(lightbox);
};

const onLoadMore = () => {
  imgApiService.incrementPage();
  fetchImg();
  // lightbox.refresh();

  // console.log(lightbox);
};

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
