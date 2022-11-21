getTopRated()

let categoriesList = [
    'History',
    'Drama',
    'Documentary',
    'Sport',
    'Music',
    'Animation',
    'News',
    'Adventure',
    'Adult',
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
    'Reality-TV',
    'War',
    'Musical',
]

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

/*async function getTopRated() {
    await fetch(
        `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes`
    )
        .then((res) => {
            return res.json()
        })
        .then(async function (responseAPI) {
            let sortedByRating = await responseAPI
            if (sortedByRating) {
                console.log(sortedByRating['results'].slice(1, 5))
                fillBestMovie(sortedByRating['results'][0])
                fillTopRatedMovies(sortedByRating['results'].slice(1, 5))
            }
        })
        .catch((error) => console.error('Erreur de la requête API'))
}*/

function fillBestMovie(bestMovie) {
    let items = document.querySelector('#best_movie')
    console.log(bestMovie)
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
