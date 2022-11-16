export function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class = "gallery__link" href="${largeImageURL}">
            <div class="gallery__item">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
                <div class="gallery__info">
                    <p class="gallery__info-item">
                        <b>Likes</b> ${likes}
                    </p>
                    <p class="gallery__info-item">
                        <b>Views</b> ${views}
                    </p>
                    <p class="gallery__info-item">
                        <b>Comments</b> ${comments}
                    </p>
                    <p class="gallery__info-item">
                        <b>Downloads</b> ${downloads}
                    </p>
                </div>
            </div>
        </a>`
    )
    .join('');
}
