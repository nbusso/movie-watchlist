import { getWatchlist, removeFromWatchlist } from "./data/data.js"

// DOM elements
const watchlistContainer = document.getElementById('watchlist-container')

// Events 
watchlistContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-from-watchlist')) {
        e.preventDefault()
        const imdbID = e.target.closest('.remove-from-watchlist').dataset.imdbid
        removeMovieFromWatchlist(imdbID)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    renderWatchlist()
})

// Functions
function renderWatchlist() {
    const watchlist = getWatchlist()

    if (watchlist.length === 0) {
        showEmptyWatchlistState()
        return
    }

    const watchlistHTML = watchlist.map(movie => `
        <section class="movie-card">
            <div class="movie-card-img">
                <img src="${movie.Poster}">
            </div>
            <div class="movie-card-info">
                <div class="movie-card-info-title">
                    <h2>${movie.Title}</h2>
                    <span>⭐️ ${movie.imdbRating}</span>
                </div>
                <div class="movie-card-info-type">
                    <span>${movie.Runtime}</span>
                    <span>${movie.Genre}</span>
                    <span><a href="#" class="remove-from-watchlist" data-imdbid="${movie.imdbID}"><img src="../assets/img/icon-minus.svg" alt="Remove from watchlist"> Remove</a></span>
                </div>
                <div class="movie-card-info-plot">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </section>
    `).join('')

    watchlistContainer.innerHTML = watchlistHTML
}

function removeMovieFromWatchlist(imdbID) {
    removeFromWatchlist(imdbID)
    renderWatchlist()

    const searchResults = JSON.parse(localStorage.getItem('searchResults')) || []
    if (searchResults.length > 0) {
        localStorage.setItem('searchResults', JSON.stringify(searchResults))
    }
    console.log('Movie removed from watchlist')
}

function showEmptyWatchlistState() {
    watchlistContainer.innerHTML = `
        <div class="empty-state">
            <p>Your watchlist is looking a little empty...</p>
            <a href="./index.html">
                <img src="assets/img/icon-plus.svg" alt="Add movies">
                Let's add some movies!
            </a>
        </div>
    `
}