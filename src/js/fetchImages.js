import axios from 'axios';

axios.defaults.baseURL = "https://pixabay.com/api/";

const searchParams = new URLSearchParams({
    key:"31354744-e6340b12404bc1f4908fb1f36",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  });

export async function fetchImages(searchImg, page, perPage){
    const response = await axios.get(
        `?${searchParams}&q=${searchImg}&page=${page}&per_page=${perPage}`,
      );
      return response;
}