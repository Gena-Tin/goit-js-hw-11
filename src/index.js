import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';

import { fetchImages } from './js/fetchImages';
import { createMarkup } from './js/markup';

const ref = {
  searchForm: document.querySelector('.search-form'),
  inputField: document.querySelector('input'),
  loadMoreBtm: document.querySelector('.load-more'),
  imageList: document.querySelector('.gallery'),
  endOfSearch: document.querySelector('.end-of-search'),
};

let stopLoad = true;
let query = '';
let page = 1;
const perPage = 40;
const simpleLightBox = new SimpleLightbox('.gallery a');

ref.loadMoreBtm.classList.add('is-hidden');
ref.endOfSearch.classList.add('is-hidden');

ref.loadMoreBtm.addEventListener('click', loadMoreHandler);
ref.searchForm.addEventListener('submit', submitHandler);

function submitHandler(e) {
  page = 1;
  e.preventDefault();

  ref.imageList.innerHTML = '';
  ref.loadMoreBtm.classList.add('is-hidden');
  ref.endOfSearch.classList.add('is-hidden');

  window.scrollTo({ top: 0 });
  query = ref.inputField.value.trim();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      ref.endOfSearch.classList.add('is-hidden');

      stopLoad = false;

      notifySuccessOrNo(data.hits, data.totalHits);
      notifyEndOfSearch(page, data.totalHits);

      if (data.totalHits > perPage) {
        ref.loadMoreBtm.classList.remove('is-hidden');
      }
      ref.imageList.innerHTML = createMarkup(data.hits);

      simpleLightBox.refresh();
    })
    .catch(error => console.log(error));
}

function loadMoreHandler() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      ref.imageList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      loadMoreScrollDown();

      simpleLightBox.refresh();

      stopLoad = false;

      notifyEndOfSearch(page, data.totalHits);
    })
    .catch(error => console.log(error));
}

//---------------------------------------------
function loadMoreScrollDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight,
    behavior: 'smooth',
  });
}

function autoLoader() {
  // нижняя граница документа
  let windowRelativeBottom =
    document.documentElement.getBoundingClientRect().bottom;

  // если пользователь прокрутил достаточно далеко (< 100px до конца)
  if (
    windowRelativeBottom < document.documentElement.clientHeight + 100 &&
    stopLoad === false
  ) {
    loadMoreHandler();

    stopLoad = true;
  }
}

function notifyEndOfSearch(page, totalHits) {
  const totalPages = Math.round(totalHits / perPage);
  if (totalHits <= perPage || page > totalPages) {
    stopLoad = true;

    ref.loadMoreBtm.classList.add('is-hidden');
    ref.endOfSearch.classList.remove('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }
}

function notifySuccessOrNo(hits, totalHits) {
  if (hits.length === 0) {
    stopLoad = true;

    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    stopLoad = false;

    window.addEventListener('scroll', throttle(autoLoader, 1000));

    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
