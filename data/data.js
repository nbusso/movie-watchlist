// Get watchlist from localStorage
function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || []
}

// Save in watchlist
function saveToWatchlist(movie) {
    const currentWatchlist = getWatchlist()
    const alreadyExists = currentWatchlist.some(watchedMovie => watchedMovie.imdbID === movie.imdbID)

    if(!alreadyExists) {
        currentWatchlist.push(movie)
        localStorage.setItem('watchlist', JSON.stringify(currentWatchlist))
        return true
    }
    return false
}

// Remove from watchlist
function removeFromWatchlist(imdbID) {
    const currentWatchlist = getWatchlist()
    const filteredWatchlist = currentWatchlist.filter(movie => movie.imdbID !== imdbID)
    localStorage.setItem('watchlist', JSON.stringify(filteredWatchlist))
    return filteredWatchlist
}

export { getWatchlist, saveToWatchlist, removeFromWatchlist }