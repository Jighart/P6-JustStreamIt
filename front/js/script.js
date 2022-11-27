const numberOfCategories = 3
const moviesPerCategory = 7

getCategories()
getTopRated()

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
    fillTopRatedMovies(topMovies.slice(1, moviesPerCategory + 1))
}

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
    fillCategories(movies.slice(0, moviesPerCategory), cat)
}

function fillBestMovie(bestMovie) {
    let best = document.querySelector('#best_movie')
    best.insertAdjacentHTML(
        'beforeEnd',
        `<div class="featured__left"><h2>${bestMovie.title}</h2>
        <button class="btn-play">► Play</button></div>
        <img src="${bestMovie.image_url}" class="modalImg" alt="Affiche du film" onclick=openModal(${bestMovie.id})>
        `
    )
}

function fillTopRatedMovies(topMovies) {
    let items = document.querySelector('#top_rated_movies')
    items.insertAdjacentHTML(
        'beforeEnd',
        `
        <i class="fas fa-chevron-circle-left" onclick="moveCarouselRight(carousel__topRated)"></i>
        <i class="fas fa-chevron-circle-right" onclick="moveCarouselLeft(carousel__topRated)"></i>
        <h2>Films les mieux notés</h2><div class="carousel__container" id="carousel__topRated"></div>
        `
    )
    for (let movie of topMovies)
        document
            .querySelector('#carousel__topRated')
            .insertAdjacentHTML(
                'beforeEnd',
                `<img src="${movie.image_url}" class="modalImg" alt="Affiche du film" onclick=openModal(${movie.id})>`
            )
}

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
        'Western',
        'Mystery',
        //'Reality-TV',
        'War',
        'Musical',
    ]
    let n = 0

    // Picks a random category and removes it from the list until number of categories is reached
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
    //createCarousel()
}

function fillCategories(movies, cat) {
    console.log(cat)

    let catHTML = document.querySelector(`#category__${cat}`)
    catHTML.insertAdjacentHTML(
        'beforeEnd',
        `<h2>${cat}</h2>
        <i class="fas fa-chevron-circle-left"></i>
        <i class="fas fa-chevron-circle-right"></i>`
    )
    for (let movie of movies) {
        catHTML.insertAdjacentHTML(
            'beforeEnd',
            `<img src="${movie.image_url}" class="modalImg" alt="Affiche du film" onclick=openModal(${movie.id}) />
            `
        )
    }
}

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

function closeModal() {
    let modalWrapper = document.querySelector('.modal-wrapper')
    modal.style.display = 'none'
    modalWrapper.innerHTML =
        '<p class="modal-close" onclick="closeModal()">Fermer</p>'
}

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

// class Carousel {
//     constructor(element, options = {}) {
//         this.element = element
//         this.options = Object.assign(
//             {},
//             {
//                 slidesToScroll: 1,
//                 slidesVisible: 1,
//             },
//             options
//         )
//         //let ratio = this.options.slidesToScroll / this.options.slidesVisible
//         console.log(ratio)
//     }
// }

// new Carousel(document.querySelectorAll('.carousel'), {
//     slidesToScroll: 7,
//     slidesVisible: 4,
// })

function moveCarouselLeft(selected) {
    selected.style.left = '-75%'
}

function moveCarouselRight(selected) {
    selected.style.left = '0'
}
