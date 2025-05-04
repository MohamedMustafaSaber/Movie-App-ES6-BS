const dummyUser = {
    Email: "test@example.com",
    username: "mohamed",
    password: "123",
    favorites: {
        movie: [],
        tvShows: [],
        people: []
    }
};

// Simulate a logged-in user
localStorage.setItem("currentUser", JSON.stringify(dummyUser));
localStorage.setItem("users", JSON.stringify([dummyUser]));

document.addEventListener('DOMContentLoaded',function(){
    let movies = [];
    let tvShows = [];
    let people = [];

    async function fetchMovies() {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQyNDE1ZDMxOWIzOTgwODdmODlkZTFiMDI3NDc1NCIsIm5iZiI6MTY2NDc4MjAwNy4xMDMwMDAyLCJzdWIiOiI2MzNhOGViNzRmMzNhZDAwODVhZDExNTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Xa73zfFcIae9R7iXVPCRiDg2dJzAJQhdgYNnVe1eQw8'
            }
        });
        const data = await response.json();
        movies = data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating:  movie.vote_average
        }));
        render(movies, 'movie-list');
    }

    async function fetchTvShows() {
        const response = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQyNDE1ZDMxOWIzOTgwODdmODlkZTFiMDI3NDc1NCIsIm5iZiI6MTY2NDc4MjAwNy4xMDMwMDAyLCJzdWIiOiI2MzNhOGViNzRmMzNhZDAwODVhZDExNTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Xa73zfFcIae9R7iXVPCRiDg2dJzAJQhdgYNnVe1eQw8'
            }
        });
        const data = await response.json();
        tvShows = data.results.map(tvShow => ({
            id: tvShow.id,
            title: tvShow.name,
            img: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
            rating: tvShow.vote_average
        }));
        render(tvShows, 'tvShows-list');
    }

    async function fetchPeople() {
        const response = await fetch('https://api.themoviedb.org/3/trending/person/day?language=en-US', {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQyNDE1ZDMxOWIzOTgwODdmODlkZTFiMDI3NDc1NCIsIm5iZiI6MTY2NDc4MjAwNy4xMDMwMDAyLCJzdWIiOiI2MzNhOGViNzRmMzNhZDAwODVhZDExNTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Xa73zfFcIae9R7iXVPCRiDg2dJzAJQhdgYNnVe1eQw8'
            }
        });
        const data = await response.json();
        people = data.results
        .filter(person =>  person.profile_path ).map(person => ({
            id: person.id,
            title: person.name,
            img: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
            rating: person.popularity
        }));
        render(people, 'people-list');
    }

    function render(data, containerID) {
        let container = document.getElementById(containerID);
        container.innerHTML = '';

        data.forEach(item => {
            let column = document.createElement('div');
            column.className = 'col-md-2';

            let currentUser = localStorage.getItem('currentUser');

            let card = document.createElement('div');
            card.className = 'card'; 

            let isFavorited = false;
            if (currentUser) {
                currentUser = JSON.parse(currentUser); 
                const type = containerID.replace('-list', '');
                isFavorited = currentUser.favorites?.[type]?.includes(item.id);
            }
            const iconClass = isFavorited ? 'fas fa-heart text-danger' : 'fas fa-heart';
            
            card.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="img-fluid">
                <div class="card-rating">${Math.round(item.rating * 10) / 10}</div>
                <span class="favorite-icon">
                    <i class="${iconClass}"></i>
                </span>
                <div class="card-title">${item.title}</div>
                
            `;
            
            let favoriteIcon = card.querySelector('.favorite-icon');
            favoriteIcon.addEventListener('click', () => toggleFavorite(item.id, containerID.replace('-list', '')));

            column.appendChild(card)
            container.appendChild(column);
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) {
                    if (!e.target.closest('.favorite-icon')) {
                        fetchDetails(item.id, containerID.split('-')[0]);
                        document.activeElement.blur();
                        myModal.show();
                    }
                }
        })
        });

    }

    function toggleFavorite(itemID, type) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            const toast = new bootstrap.Toast(document.getElementById('loginToast'));
            toast.show();
            return;
        }
        
        
    
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userIndex = users.findIndex(user => user.Email === currentUser.Email);
        if (userIndex === -1) return;
    
    
        let favList = users[userIndex].favorites[type];
        let exists = favList.find(fav => fav.id === itemID);
    
        if (exists) {
            users[userIndex].favorites[type] = favList.filter(fav => fav.id !== itemID);
        } else {
            users[userIndex].favorites[type].push(itemID);
        }
    
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        render(movies, 'movie-list');
        render(tvShows, 'tvShows-list');
        render(people, 'people-list');
    }
    
    function search(){
        var searchWord = document.getElementById('search').value.toLowerCase();
        var filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchWord));
        var filteredTV = tvShows.filter(tvShow => tvShow.title.toLowerCase().includes(searchWord));
        var filteredPeople = people.filter(person => person.title.toLowerCase().includes(searchWord));
        render(filteredMovies, 'movie-list');
        render(filteredTV, 'tv-list');
        render(filteredPeople, 'People-list');
    }
    document.getElementById('search').addEventListener('input',search);
    fetchMovies();
    fetchTvShows();
    fetchPeople();
})

