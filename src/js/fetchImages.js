const BASE_URL = "https://pixabay.com/api/?";

const searchParams = new URLSearchParams({
    key:"31354744-e6340b12404bc1f4908fb1f36",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    q:"",
  });

export function fetchImages(searchImg){
    return fetch(`${BASE_URL}${searchParams}${searchImg}`)
    .then(response =>  {
        if (!response.ok) {throw new Error(`Error ${response.statusText}`)}
        return response.json();
    })
}