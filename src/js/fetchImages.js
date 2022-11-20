import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchImg, page, perPage) {
  const searchParams = new URLSearchParams({
    key: '31354744-e6340b12404bc1f4908fb1f36',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    q: searchImg,
    per_page: perPage,
    page: page,
  });

  const response = await axios.get(`?${searchParams}`);

  if (searchImg === '') {
    Notify.warning(
      "UPS. I can't find the void. Please try typing something other, than spaces"
    );
    return;
  }
  return response;
}
