getTopRated()
getCategories()

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
    fillTopRatedMovies(topMovies.slice(1, 8))
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
    fillCategories(movies.slice(0, 7), cat)
}

function fillBestMovie(bestMovie) {
    let items = document.querySelector('#best_movie')
    //console.log(bestMovie)
    items.insertAdjacentHTML(
        'beforeEnd',
        `<h2>${bestMovie.title}</h2>
        <button class="button">► Play</button>
        <img src="${bestMovie.image_url}">
        `
    )
}

function fillTopRatedMovies(topMovies) {
    let items = document.querySelector('#top_rated_movies')
    for (let movie of topMovies)
        items.insertAdjacentHTML(
            'beforeEnd',
            `
            <img src="${movie.image_url}">
            `
        )
}

function getCategories() {
    numberOfCategories = 3
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
    let items = document.querySelector('#categories')
    items.insertAdjacentHTML('beforeEnd', `<h2>${cat}</h2>`)
    //console.log(movies)
    for (let movie of movies)
        items.insertAdjacentHTML(
            'beforeEnd',
            `<img src="${movie.image_url}">
            `
        )
}
