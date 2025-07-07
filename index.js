
//DOM elements
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const resultsContainer = document.getElementById('results-container')

// events
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    searchMovie(searchInput.value)
})

// functions
async function searchMovie(searchInput) {
    const res = await fetch(`http://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=368ccef`)
    const data = await res.json()
    const searchResults = data.Search
    
    const moviePromises = searchResults.slice(0, 3).map(result => getMovieInfo(result.imdbID))
    const completeInfo = await Promise.all(moviePromises)

    resultsContainer.innerHTML = completeInfo.join('')
}

async function getMovieInfo(imdbID) {
    console.log(imdbID)
    const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=368ccef`)
    const data = await res.json()

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
                        <span><a href="#"><img src="assets/img/icon-plus.svg" alt="Add to watchlist"> Watchlist</a></span>
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