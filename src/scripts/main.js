const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


const trendingPrevContainer = document.querySelector('.trendingPreview-movieList');
const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')


async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');

    const trendingMoviesRaw = data.results

    let htmlContent = ''; 
    trendingMoviesRaw.forEach(movie => {
        htmlContent += `
        <div class="movie-container">
            <img
                src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                class="movie-img"
                alt="${movie.title}"
            />
        </div>
        `
    });

    trendingPrevContainer.innerHTML = htmlContent;
}

async function getCategories() {
    const { data } = await api('genre/movie/list');

    const categories = data.genres

    let htmlContent = ''; 
    categories.forEach(category => {
        htmlContent += `
        <div class="category-container">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
        </div>
        `
    });

    previewCategoriesContainer.innerHTML = htmlContent;
}


getCategories();
getTrendingMoviesPreview();