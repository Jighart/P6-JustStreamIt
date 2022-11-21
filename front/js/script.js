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
    let items = document.querySelector('#best_movie')
    //console.log(bestMovie)
    items.insertAdjacentHTML(
        'beforeEnd',
        `<h2>${bestMovie.title}</h2>
        <button class="btn-play">► Play</button>
        <img src="${bestMovie.image_url}" class="modalImg" alt="Affiche du film" data-id="${bestMovie.id}" onclick=openModal(${bestMovie.id})>
        `
    )
}

function fillTopRatedMovies(topMovies) {
    let items = document.querySelector('#top_rated_movies')
    items.insertAdjacentHTML('beforeEnd', `<h2>Films les mieux notés</h2>`)
    for (let movie of topMovies)
        items.insertAdjacentHTML(
            'beforeEnd',
            `<img src="${movie.image_url}" class="modalImg" alt="Affiche du film" data-id="${movie.id}" onclick=openModal(${movie.id})>`
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
        n++
    }
}

function fillCategories(movies, cat) {
    console.log(cat)
    document
        .querySelector('#categories')
        .insertAdjacentHTML(
            'beforeEnd',
            `<div class="category carousel"></div>`
        )
    let catHTML = document.querySelector('.category.carousel')
    catHTML.insertAdjacentHTML('beforeEnd', `<h2>${cat}</h2>`)
    //console.log(movies)
    for (let movie of movies) {
        catHTML.insertAdjacentHTML(
            'beforeEnd',
            `<img src="${movie.image_url}" class="modalImg" alt="Affiche du film" data-id="${movie.id}" onclick=openModal(${movie.id}) />
            `
        )
    }
}

async function openModal(id) {
    let modal = document.querySelector('#modal')
    let modalWrapper = document.querySelector('.modal-wrapper')

    //let movie = document.querySelector(`[data-id="${id}"]`)
    //console.log(movie)
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
    console.log(movie)

    modalWrapper.insertAdjacentHTML(
        'beforeEnd',
        `<img src="${movie.image_url}" class="modal-image" alt="${
            movie.title
        }" />
        <h3 class="modal-title">${movie.title}</h3>
        <p class="modal-year-country">Sorti en ${movie.year}, ${
            movie.countries
        }</p>
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
        }</p>

        <p class="modal-description">${movie.long_description}</p>
        <p class="modal-actors">Avec : ${movie.actors.join(', ')}</p>
        `
    )
}
