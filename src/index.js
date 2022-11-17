import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import InfiniteScroll from 'infinite-scroll';

import { fetchImages } from './js/fetchImages';
import { createMarkup } from './js/markup';

const ref = {
    searchForm: document.querySelector(".search-form"),
    inputField: document.querySelector("input"),
    loadMoreBtm: document.querySelector(".load-more"),
    imageList: document.querySelector(".gallery"),
    endOfSearch: document.querySelector(".end-of-search")
    
}

let query = "";
let page = 1;
const perPage = 30;


ref.loadMoreBtm.classList.add("is-hidden");
ref.endOfSearch.classList.add("is-hidden");

ref.loadMoreBtm.addEventListener("click", loadMoreHandler);
ref.searchForm.addEventListener("submit", submitHandler);
 
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


function submitHandler(e){
    e.preventDefault();
    ref.imageList.innerHTML = '';
    ref.loadMoreBtm.classList.add("is-hidden");

    window.scrollTo({ top: 0 });
    query = ref.inputField.value.trim();
    if(query===''){
        Notify.warning('UPS. I can\'t find the void. Please try typing something');
        return;
    }

    fetchImages(query, page, perPage)
    .then(({data}) => {
        ref.endOfSearch.classList.add("is-hidden");
        console.log(data);

        if(data.hits.length === 0){
            Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return;
        }else{
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
        };

        if(data.totalHits > perPage){
            ref.loadMoreBtm.classList.remove("is-hidden");
        }

        ref.imageList.innerHTML = createMarkup(data.hits),

        simpleLightBox = new SimpleLightbox('.gallery a').refresh()      

    }).catch(error => console.log(error));
}

function loadMoreHandler(){
    page += 1;
    fetchImages(query, page, perPage)
    .then(({data}) => {
        const totalPages = Math.round(data.totalHits / perPage);
        console.log(totalPages);
        if(page >= totalPages){
            ref.loadMoreBtm.classList.add("is-hidden");
            ref.endOfSearch.classList.remove("is-hidden");
            Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        }
        ref.imageList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        simpleLightBox = new SimpleLightbox('.gallery a').refresh()
    }).catch(error => console.log(error));
}


//Прокрутка страницы
//Сделать плавную прокрутку страницы после запроса 
//и отрисовки каждой следующей группы изображений. 
//Вот тебе код подсказка, а разберись в нём самостоятельно.
// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });

// Бесконечный скролл
// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.