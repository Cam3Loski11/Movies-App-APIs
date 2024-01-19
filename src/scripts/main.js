// Data

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        "language": navigator.language || "es-ES",
    },
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item) {
        movies = item;
    } else {
        movies = {}
    }

    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if(likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

// Utils

const lazyLoader = new IntersectionObserver((entries) => { // creamos una instancia del objeto observador
    entries.forEach((entry) => {  // las entries serian las imagenes que entran en forma de array
        if (entry.isIntersecting) {  // hacemos un for each de cada entry para dependiendo de si esta interceptando
            const url = entry.target.getAttribute('data-img')  // cargar la imagen o no
            entry.target.setAttribute('src', url);
        }
    });
});


function createMovies(
    movies,
    container,
    {
        lazyLoad = false, // colocamos false para que no siempre se cree este observador
        clean = true,
    } = {},) {

    if (clean) {
    container.innerHTML = '';
    }

    movies.forEach(movie => {
        if(movie.poster_path === null) {
            return
        } else {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');
        
            const movieImg = document.createElement('img');
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src',
                'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );
            movieImg.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
            });

            const movieBtn = document.createElement('button');
            movieBtn.classList.add('movie-btn');
            likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
            movieBtn.addEventListener('click', () => {
                movieBtn.classList.toggle('movie-btn--liked');
                //Agregar pelicula a local storage
                likeMovie(movie);
                getLikedMovies();
            })
        
            if (lazyLoad) {
                lazyLoader.observe(movieImg); // Aqui validamos si queremos un lazyload o no dependiendo de la seccion
            }
        
    
            movieContainer.appendChild(movieImg);
            movieContainer.appendChild(movieBtn);
            container.appendChild(movieContainer);
        }
    });
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {  
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}


// APIs
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const trendingMoviesRaw = data.results;

    createMovies(trendingMoviesRaw, trendingMoviesPreviewList, true); // selector que esta en el archivo selectors
}

async function getCategories() {
    const { data } = await api('genre/movie/list');

    const categories = data.genres;

    createCategories(categories, categoriesPreviewList)  ;
};

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesByCat(id) {
    return async function () {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement; // esto es para desestructurar

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        if(scrollIsBottom) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
        
            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}


async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;

    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });

}

function getPaginatedMoviesSearch(query) {
    return async function () {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        const pageIsNotMax = page < maxPage;
    
        if(scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
        
            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const trendingMoviesRaw = data.results;

    maxPage = data.total_pages;

    createMovies(trendingMoviesRaw, genericSection, { lazyLoad: true, clean: true }); // selector que esta en el archivo selectors
}

async function getPaginatedTrendingMovies() {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;


    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
                const pageIsNotMax = page < maxPage;
    
        createMovies(
            movies,
            genericSection,
            { lazyLoad: true, clean: false },
        );
    }
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;
    createMovies(relatedMovies, relatedMoviesContainer);
    relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const likedMoviesValues = Object.values(likedMovies);

    createMovies(likedMoviesValues, likedMoviesListArticle, { lazyLoad: true, clean: true });
}