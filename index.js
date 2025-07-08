import { getWatchlist, saveToWatchlist } from './data/data.js'

let moviesResults = []

//DOM elements
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const resultsContainer = document.getElementById('results-container')

// load previous results
document.addEventListener('DOMContentLoaded', () => {
    moviesResults = JSON.parse(localStorage.getItem('searchResults')) || []
    if (moviesResults.length > 0) {
        renderMovieResults()
    }
})

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
    await Promise.all(moviePromises)
    
    // Save in localStorage
    localStorage.setItem('searchResults', JSON.stringify(moviesResults))
    
    // Render results
    renderMovieResults()
}


async function getMovieInfo(imdbID) {
    console.log(imdbID)
    const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=368ccef`)
    const data = await res.json()

    moviesResults.push(data)
}

function renderMovieResults() {
    const watchlist = getWatchlist()
    
    const movieCards = moviesResults.map(data => {
        // Check if movie is already in watchlist
        const isInWatchlist = watchlist.some(movie => movie.imdbID === data.imdbID)
        
        return `
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
                        <span>
                            <a href="#" class="add-to-watchlist ${isInWatchlist ? 'in-watchlist' : ''}" data-imdbid="${data.imdbID}">
                                <img src="assets/img/${isInWatchlist ? 'icon-check.svg' : 'icon-plus.svg'}" alt="${isInWatchlist ? 'In watchlist' : 'Add to watchlist'}"> 
                                ${isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                            </a>
                        </span>
                    </div>
                    <div class="movie-card-info-plot">
                        <p>${data.Plot}</p>
                    </div>
                </div>
            </section>
        `
    })
    
    resultsContainer.innerHTML = movieCards.join('')
}


function addToWatchList(imdbID) {
    const movie = moviesResults.find(movie => movie.imdbID === imdbID)

    if (movie) {
        const movieCopy = { ...movie }
        const wasAdded = saveToWatchlist(movieCopy)
        
        if (wasAdded) {
            console.log('Movie added to watchlist:', movie.Title)
            console.log('Watchlist actual:', getWatchlist())

            renderMovieResults()
        } else {
            console.log('La película ya está en watchlist!')
        }
    }
}
