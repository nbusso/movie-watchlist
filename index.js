import watchlist from "./data/watchlist.js"

let moviesResults = []

//DOM elements
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const resultsContainer = document.getElementById('results-container')

// events
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    searchMovie(searchInput.value)
})

resultsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-watchlist')) {
        e.preventDefault()
        const imdbID = e.target.closest('.add-to-watchlist').dataset.imdbid
        addToWatchList(imdbID)
    }
})

// functions
async function searchMovie(searchInput) {
    const res = await fetch(`http://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=368ccef`)
    const data = await res.json()
    const searchResults = data.Search

    moviesResults = []
    
    const moviePromises = searchResults.slice(0, 3).map(result => getMovieInfo(result.imdbID))
    const completeInfo = await Promise.all(moviePromises)

    resultsContainer.innerHTML = completeInfo.join('')
}


async function getMovieInfo(imdbID) {
    console.log(imdbID)
    const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=368ccef`)
    const data = await res.json()

    moviesResults.push(data)

    const movieCard = `
            <section class="movie-card">
                <div class="movie-card-img">
                    <img src="${data.Poster}">
                </div>
                <div class="movie-card-info">
                    <div class="movie-card-info-title">
                        <h2>${data.Title}</h2>
                        <span>⭐️ ${data.imdbRating}</span>
                    </div>
                    <div class="movie-card-info-type">
                        <span>${data.Runtime}</span>
                        <span>${data.Genre}</span>
                        <span><a href="#" class="add-to-watchlist" data-imdbid="${data.imdbID}"><img src="assets/img/icon-plus.svg" alt="Add to watchlist"> Watchlist</a></span>
                    </div>
                    <div class="movie-card-info-plot">
                        <p>${data.Plot}</p>
                    </div>
                </div>
            </section>
    `

    // console.log(movieCard)
    return movieCard
}

function addToWatchList(imdbID) {
    const movie = moviesResults.find(movie => movie.imdbID === imdbID)

    if (movie) {
        const alreadyExists = watchlist.some(watchedMovie => watchedMovie.imdbID === imdbID)

        if (!alreadyExists) {
            const movieCopy = { ...movie }
            watchlist.push(movieCopy)
            console.log('Movie added to watchlist:', movie.Title)
            console.log('Watchlist actual:', watchlist)
        } else {
            console.log('La pelicula ya está en watchlist!')
        }
    }
}

function renderWatchlist() {

    return `
            <section class="movie-card">
                <div class="movie-card-img">
                    <img src="${watchlist.Poster}">
                </div>
                <div class="movie-card-info">
                    <div class="movie-card-info-title">
                        <h2>${watchlist.Title}</h2>
                        <span>⭐️ ${watchlist.imdbRating}</span>
                    </div>
                    <div class="movie-card-info-type">
                        <span>${watchlist.Runtime}</span>
                        <span>${watchlist.Genre}</span>
                        <span><a href="#" class="add-to-watchlist" data-imdbid="${watchlist.imdbID}"><img src="assets/img/icon-minus.svg" alt="Remove from watchlist"> Remove</a></span>
                    </div>
                    <div class="movie-card-info-plot">
                        <p>${watchlist.Plot}</p>
                    </div>
                </div>
            </section>
    `
}