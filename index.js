const resultsContainer = document.getElementById('results-container')

async function searchMovie(searchInput) {
    const res = await fetch("http://www.omdbapi.com/?s=batman&type=movie&apikey=368ccef")
    const data = await res.json()
    const searchResults = data.Search
    
    const moviePromises = searchResults.slice(0, 2).map(result => getMovieInfo(result.imdbID))
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
                    <div class="movie-card-info-title"
                        <h2>${data.Title}</h2>
                        <span>⭐️ ${data.imdbRating}</span>
                    </div>
                    <div class="movie-card-info-type">
                        <span>${data.Runtime}</span>
                        <span>${data.Genre}</span>
                        <span>Watchlist</span>
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

// console.log(await getMovieInfo('tt1877830'))
searchMovie('batman')