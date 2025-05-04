const baseurl = "https://api.themoviedb.org/3/";
const AccessToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQyNDE1ZDMxOWIzOTgwODdmODlkZTFiMDI3NDc1NCIsIm5iZiI6MTY2NDc4MjAwNy4xMDMwMDAyLCJzdWIiOiI2MzNhOGViNzRmMzNhZDAwODVhZDExNTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Xa73zfFcIae9R7iXVPCRiDg2dJzAJQhdgYNnVe1eQw8";
const queryParamter = "?language=en-US";
let movies = [];
let people = [];

async function getMovieDetails(movieId) {
    const response = await fetch(`${baseurl}movie/${movieId}${queryParamter}`, {
        headers: {
            accept: 'application/json',
            Authorization: AccessToken
        }
    });
    const data = await response.json();
    return data;
}

async function getPersonDetails(personId) {
    const response = await fetch(`${baseurl}person/${personId}${queryParamter}`, {
        headers: {
            accept: 'application/json',
            Authorization: AccessToken
        }
    });
    const data = await response.json();
    return data;
}

async function getFavoriteMovies(){
    for(let i = 0 ; i<20 ; i++){
        movies.push(await getMovieDetails(1233069));
    }
}

async function getFavoritePeople(){
    for(let i = 0 ; i<20 ; i++){
        people.push(await getPersonDetails(1));
    }
}
function renderMovies(movies, containerID) {
    let container = document.getElementById(containerID);
    container.innerHTML = '';
    let MappedMovies = movies.map(movie => {
        return {
            id: movie.id,
            title: movie.title,
            img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: movie.vote_average
        };
    });
    MappedMovies.forEach(movie => {
        let column = document.createElement('div');
        column.className = 'col-md-2';
        let card = document.createElement('div');
        card.className = 'card'; 
    
        card.innerHTML = `
        <img src="${movie.img}" alt="${movie.title}" class="img-fluid">
        <div class="card-rating">${Math.round(movie.rating * 10) / 10}</div>
        <span class="favorite-icon">
            <i class="fas fa-heart text-danger"></i>
        </span>
        <div class="card-title">${movie.title}</div>`;
        column.appendChild(card)
        container.appendChild(column);
        
    });
}

function renderPeople(people, containerID) {
    let container = document.getElementById(containerID);
    container.innerHTML = '';
    let MappedPeople = people.map(person => {
        return {
            id: person.id,
            title: person.name,
            img: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
            rating: person.popularity
        };
    });
    MappedPeople.forEach(person => {
        let column = document.createElement('div');
        column.className = 'col-md-2';
        let card = document.createElement('div');
        card.className = 'card'; 
    
        card.innerHTML = `
        <img src="${person.img}" alt="${person.title}" class="img-fluid">
        <div class="card-rating">${Math.round(person.rating * 10) / 10}</div>
        <span class="favorite-icon">
            <i class="fas fa-heart"></i>
        </span>
        <div class="card-title">${person.title}</div>`;
        column.appendChild(card)
        container.appendChild(column);
    });
}

 async function render(){
    let noFavorties = document.querySelector('.no-favorites');
    let container = document.querySelector('.data-container');
    await getFavoriteMovies();
    await getFavoritePeople();
    if(movies.length === 0 && people.length === 0){
        noFavorties.classList.remove('hide');
        container.classList.add('hide');
        console.log('No favorites found');

    }
    else{

        noFavorties.classList.add('hide');
        container.classList.remove('hide');
        renderMovies(movies, 'movie-list');
        renderPeople(people, 'people-list');
    }

}

render();