import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
//import InfiniteScroll from 'infinite-scroll';

import { fetchImages } from './js/fetchImages';
import { createMarkup } from './js/markup';

const ref = {
  searchForm: document.querySelector('.search-form'),
  inputField: document.querySelector('input'),
  loadMoreBtm: document.querySelector('.load-more'),
  imageList: document.querySelector('.gallery'),
  endOfSearch: document.querySelector('.end-of-search'),
};

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
  if (query === '') {
    Notify.warning(
      "UPS. I can't find the void. Please try typing something other, than spaces"
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      ref.endOfSearch.classList.add('is-hidden');

      notifyEndOfSearch(page, data.totalHits);
      notifySuccessOrNo(data.hits, data.totalHits);

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
      notifyEndOfSearch(page, data.totalHits);
      ref.imageList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      loadMoreScrollDown();
      simpleLightBox.refresh();
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

function notifyEndOfSearch(page, totalHits) {
  const totalPages = Math.round(totalHits / perPage);
  if (totalHits <= perPage || page > totalPages) {
    ref.loadMoreBtm.classList.add('is-hidden');
    ref.endOfSearch.classList.remove('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function notifySuccessOrNo(hits, totalHits) {
  if (hits.length === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    //-------
  }
}

// Init InfiniteScroll ==========================
// let elem = document.querySelector('.gallery');
// let infScroll = new InfiniteScroll( elem, {
//     path: ".load-more",
//   append: '.gallery__link',
//   history: false,
//   status: '.page-load-status',
// });
// // =======
// const statusBar = document.querySelector('.status-bar');

// infScroll.on( 'load', function() {
//   statusBar.textContent = `Loaded page: ${infScroll.pageIndex}`;
// });
//================================================
