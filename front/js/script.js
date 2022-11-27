const numberOfCategories = 3

getCategories()
getTopRated()

// Get data for the top overall rated movies, returns the first 1+7
async function getTopRated() {
    try {
        var data = await Promise.all([
            fetch(
                'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes'
            ).then((res) => {
                return res.json()
            }),
            fetch(
                'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes&page=2'
            ).then((res) => {
                return res.json()
            }),
        ])
        topMovies = data[0]['results'].concat(data[1]['results'])
    } catch (error) {
        console.error(error)
    }
    fillBestMovie(topMovies[0])
    fillTopRatedMovies(topMovies.slice(1, 7 + 1))
}

// Get data for top rated movies for a specified category, returns the first 7
async function getTopCat(cat) {
    try {
        var data = await Promise.all([
            fetch(
                `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes&genre=${cat}`
            ).then((res) => {
                return res.json()
            }),
            fetch(
                `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes&genre=${cat}&page=2`
            ).then((res) => {
                return res.json()
            }),
        ])
        movies = data[0]['results'].concat(data[1]['results'])
    } catch (error) {
        console.error(error)
    }
    fillCategories(movies.slice(0, 7), cat)
}

// Fills the best movie with the top movie's data from the top rated list
function fillBestMovie(bestMovie) {
    let best = document.querySelector('#best_movie')
    best.insertAdjacentHTML(
        'beforeEnd',
        `<div class="featured__left"><h2>${bestMovie.title}</h2>
        <button class="btn-play">► Play</button></div>
        <img src="${bestMovie.image_url}" class="filmImg" alt="Affiche du film" onclick=openModal(${bestMovie.id})>
        `
    )
}

// Fills the top category with movies 2-8 from the top rated list
function fillTopRatedMovies(topMovies) {
    let items = document.querySelector('#top_rated_movies')
    items.insertAdjacentHTML(
        'beforeEnd',
        `<h2>Films les mieux notés</h2>
        <i class="fas fa-chevron-circle-left" onclick="moveCarouselRight(carousel__topRated)"></i>
        <i class="fas fa-chevron-circle-right" onclick="moveCarouselLeft(carousel__topRated)"></i>
        <div class="carousel__container" id="carousel__topRated"></div>
        `
    )
    for (let movie of topMovies)
        document
            .querySelector('#carousel__topRated')
            .insertAdjacentHTML(
                'beforeEnd',
                `<img src="${movie.image_url}" class="filmImg" alt="Affiche du film" onclick=openModal(${movie.id})>`
            )
}

// List of categories, disabled categories with less than 5 movies or with top movies pictures returning a 404 error from Amazon
function getCategories() {
    let categoriesList = [
        'History',
        'Drama',
        //'Documentary',
        'Sport',
        'Music',
        'Animation',
        //'News',
        'Adventure',
        //'Adult',
        'Sci-Fi',
        'Family',
        'Romance',
        'Horror',
        'Comedy',
        'Biography',
        'Fantasy',
        'Film-Noir',
        'Crime',
        'Action',
        'Thriller',
        //'Western',
        'Mystery',
        //'Reality-TV',
        //'War',
        'Musical',
    ]

    // Picks a random category and removes it from the list until number of categories is reached
    let n = 0

    while (n < numberOfCategories) {
        category = categoriesList[(categoriesList.length * Math.random()) | 0]
        getTopCat(category)
        categoriesList = categoriesList.filter((cat) => cat !== category)
        document
            .querySelector('#categories')
            .insertAdjacentHTML(
                'beforeEnd',
                `<div class="carousel" id="category__${category}"></div>`
            )
        n++
    }
}

// Creates the HTML block for each category and fills it with movies data
function fillCategories(movies, cat) {
    console.log(cat)

    let catHTML = document.querySelector(`#category__${cat}`)
    catHTML.insertAdjacentHTML(
        'beforeEnd',
        `<h2>${cat}</h2>
        <i class="fas fa-chevron-circle-left" onclick="moveCarouselRight(carousel__${cat})"></i>
        <i class="fas fa-chevron-circle-right" onclick="moveCarouselLeft(carousel__${cat})"></i>
        <div class="carousel__container" id="carousel__${cat}"></div>`
    )
    for (let movie of movies) {
        document.querySelector(`#carousel__${cat}`).insertAdjacentHTML(
            'beforeEnd',
            `<img src="${movie.image_url}" class="filmImg" alt="Affiche du film" onclick=openModal(${movie.id}) />
            `
        )
    }
}

// Makes the modal window visible and fetches the movie's data
async function openModal(id) {
    let modal = document.querySelector('#modal')

    await fetch(`http://localhost:8000/api/v1/titles/${id}`)
        .then((res) => {
            return res.json()
        })
        .then(async function (responseAPI) {
            let movie = await responseAPI
            fillModal(movie)
        })
        .catch((error) => console.error(error))

    modal.style.display = null
}

// Makes the modal window invisible and clears the HTML content
function closeModal() {
    let modalWrapper = document.querySelector('.modal-wrapper')
    modal.style.display = 'none'
    modalWrapper.innerHTML =
        '<p class="modal-close" onclick="closeModal()">Fermer</p>'
}

// Fills the modal window with the movie's data
function fillModal(movie) {
    let modalWrapper = document.querySelector('.modal-wrapper')

    modalWrapper.insertAdjacentHTML(
        'beforeEnd',
        `<div class="modal__top">
        <img src="${
            movie.image_url
        }" class="modal-image modal__top--left" alt="${movie.title}" />
        <div class="modal__top--right">
        <h3 class="modal-title">${movie.title}</h3>
        <p class="modal-year-country">Sorti en ${
            movie.year
        }, ${movie.countries.join(', ')}</p>
        <p class="modal-genres">Genre : ${movie.genres.join(', ')}</p>
        <p class="modal-duration">Durée : ${movie.duration} minutes</p>
        <p class="modal-score">Score IMDB : ${movie.imdb_score} (${
            movie.votes
        } votes)</p>
        <p class="modal-rated">Rated : ${movie.rated}</p>
        <p class="modal-directors">Réalisé par : ${movie.directors.join(
            ', '
        )}</p>
        <p class="modal-box-office">Box office : ${
            movie.worldwide_gross_income !== null
                ? movie.worldwide_gross_income + ' ' + movie.budget_currency
                : 'N/A'
        }</p></div></div>

        <p class="modal-description">${movie.long_description}</p>
        <p class="modal-actors">Avec : ${movie.actors.join(', ')}</p>
        `
    )
}

// Slide functions for carousel buttons
function moveCarouselLeft(carousel) {
    carousel.style.left = '-75%'
}

function moveCarouselRight(carousel) {
    carousel.style.left = '0'
}
