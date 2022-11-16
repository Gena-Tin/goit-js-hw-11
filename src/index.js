import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/fetchImages';
import { createMarkup } from './js/markup';

const ref = {
    searchForm: document.querySelector(".search-form"),
    inputField: document.querySelector("input"),
    loadMoreBtm: document.querySelector(".load-more"),
    imageList: document.querySelector(".gallery"),
    
}

ref.loadMoreBtm.classList.add("is-hidden");
ref.searchForm.addEventListener("submit", submitHandler);

function submitHandler(e){
    e.preventDefault();

    fetchImages(ref.inputField.value.trim())
    .then(data => {
        showMarkup = createMarkup(data.hits),
        ref.imageList.innerHTML = showMarkup,

        simpleLightBox = new SimpleLightbox('.gallery a').refresh()
       
    });
}



//Прокрутка страницы
//Сделать плавную прокрутку страницы после запроса и отрисовки каждой следующей группы изображений. Вот тебе код подсказка, а разберись в нём самостоятельно.
// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });



// Бесконечный скролл
// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.