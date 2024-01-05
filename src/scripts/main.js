const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


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

    trendingMoviesPreviewList.innerHTML = htmlContent; // selector que esta en el archivo selectors
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
    categoriesPreviewList.innerHTML = htmlContent; // selector que esta en el archivo selectors

    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach((categoryTitle, i) => {
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + categories[i].id + '-' + categoryTitle.textContent;
            headerCategoryTitle.innerText = categoryTitle.textContent;
        })
    })
};


async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;

    let htmlContent = '';
    movies.forEach(movie => {
        htmlContent += `
        <div class="movie-container">
            <img
                src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                class="movie-img"
                alt="${movie.title}"
            />
        </div>
        `
    })

    genericSection.innerHTML = htmlContent
}