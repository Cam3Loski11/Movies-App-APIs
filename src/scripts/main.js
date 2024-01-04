const BASE_URL = 'https://api.themoviedb.org/3/'

const trendingPrevContainer = document.querySelector('.trendingPreview-movieList')

async function getTrendingMoviesPreview() {
    const res = await fetch(BASE_URL + 'trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();

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
}getTrendingMoviesPreview()