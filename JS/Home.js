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

            let CurrentUser = sessionStorage.getItem('CurrentUser');

            let card = document.createElement('div');
            card.className = 'card'; 

            let isFavorited = false;
            if (CurrentUser) {
                CurrentUser = JSON.parse(CurrentUser); 
                const type = containerID.replace('-list', '');
                isFavorited = CurrentUser.favorites?.[type]?.includes(item.id);
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
        let CurrentUser = JSON.parse(sessionStorage.getItem('CurrentUser'));
        if (!CurrentUser) {
            const toast = new bootstrap.Toast(document.getElementById('loginToast'));
            toast.show();
            return;
        }
        
        
    
        let users = JSON.parse(localStorage.getItem('Users')) || [];
        let userIndex = users.findIndex(user => user.Email === CurrentUser.Email);
        if (userIndex === -1) return;
    
    
        let favList = users[userIndex].favorites[type];
        let exists = favList.includes(itemID);
    
        if (exists) {
            users[userIndex].favorites[type] = favList.filter(fav => fav !== itemID);
        } else {
            users[userIndex].favorites[type].push(itemID);
        }
    
        localStorage.setItem('Users', JSON.stringify(users));
        sessionStorage.setItem('CurrentUser', JSON.stringify(users[userIndex]));

        render(movies, 'movie-list');
        render(tvShows, 'tvShows-list');
        render(people, 'people-list');
    }

    async function fetchDetails(Id,type) {
        if(type=="tvShows"){
            type="tv";
        }
        else if(type=="people"){
            type="person";
        }
        try {
            const response = await fetch(`https://api.themoviedb.org/3/${type}/${Id}?language=en-US`, {
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQyNDE1ZDMxOWIzOTgwODdmODlkZTFiMDI3NDc1NCIsIm5iZiI6MTY2NDc4MjAwNy4xMDMwMDAyLCJzdWIiOiI2MzNhOGViNzRmMzNhZDAwODVhZDExNTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Xa73zfFcIae9R7iXVPCRiDg2dJzAJQhdgYNnVe1eQw8'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch details');
            }
            
            const data = await response.json();
            
            
            renderDetails(data,type);
            
        } catch (error) {
            console.error('Error:', error);
            renderError();
        }
    }

    function renderDetails(data,type) {
        const detailsImage = document.getElementById('detailsImage');
        const detailsContent = document.getElementById('detailsContent');
        
        const image = document.createElement('img');
        image.src = `https://image.tmdb.org/t/p/w500${data.poster_path || data.profile_path}`;
        image.alt = data.title || data.name;
        image.loading = 'lazy';
        image.classList.add("img-thumbnail")
        image.classList.add("img-fluid")
        image.classList.add("w-75")
        image.classList.add("h-auto")
        image.onerror = function () {
            this.src = 'path/to/fallback-image.jpg';
            this.alt = 'Image not available';
        };
    
        detailsImage.innerHTML = '';
        detailsImage.appendChild(image);
    
    
        if (type === 'person') {
            // معلومات شخص
            const birthDate = data.birthday ? new Date(data.birthday).toLocaleDateString('en-US') : 'Unknown';
            const deathDate = data.deathday ? new Date(data.deathday).toLocaleDateString('en-US') : null;
    
            detailsContent.innerHTML = `
                <h1>${data.name}</h1>
                <h4><span>Department:</span> ${data.known_for_department}</h4>
                <h4><span>Born:</span> ${birthDate}</h4>
                ${deathDate ? `<h4><span>Died:</span> ${deathDate}</h4>` : ''}
                <h4><span>Place of Birth:</span> ${data.place_of_birth || 'Unknown'}</h4>
                <h4><span>Popularity:</span> ${Math.round(data.popularity)}</h4>
                ${data.biography ? `<p class="overview">${getFirstSentences(data.biography, 5)}</p>` :
                data.overview ? `<p class="overview">${data.overview}</p>` :
                '<p class="overview">No overview available.</p>'}            `;
        } else {
            // معلومات فيلم أو مسلسل
            const releaseDate = data.release_date || data.first_air_date;
            const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString('en-US') : 'Unknown';
    
            const voteAverage = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
    
            detailsContent.innerHTML = `
                <h1>${data.title || data.name}</h1>
                ${data.tagline ? `<h2>"${data.tagline}"</h2>` : ''}
                <div class="detCards">
                    ${(data.genres || []).map(genre => `<h3 class="detCard">${genre.name}</h3>`).join('')}
                </div>
                <h4 class="vote"><span>Rating:</span> ${voteAverage} / 10</h4>
                <h4 class="voteCount"><span>Vote Count:</span> ${data.vote_count?.toLocaleString() || 'N/A'}</h4>
                <h4 class="popularity"><span>Popularity:</span> ${Math.round(data.popularity)}</h4>
                <h4 class="releaseDate"><span>Release Date:</span> ${formattedDate}</h4>
                ${data.overview ? `<p class="overview">${data.overview}</p>` : '<p class="overview">No overview available.</p>'}
            `;
        }
    }
    
    function getFirstSentences(text, count) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        return sentences.slice(0, count).join(' ');
    }
    
    function renderError() {
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = `
            <h1>Error Loading Content</h1>
            <p class="overview">We couldn't load the details for this item. Please try again later.</p>
        `;
    }

    const myModal = new bootstrap.Modal(document.getElementById('myModal'));

    function search(){
        var searchWord = document.getElementById('search').value.toLowerCase();
        var filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchWord));
        var filteredTV = tvShows.filter(tvShow => tvShow.title.toLowerCase().includes(searchWord));
        var filteredPeople = people.filter(person => person.title.toLowerCase().includes(searchWord));
        render(filteredMovies, 'movie-list');
        render(filteredTV, 'tvShows-list');
        render(filteredPeople, 'people-list');
    }
    document.getElementById('search').addEventListener('input',search);

    let logoutBtn=document.getElementById("logout");
    logoutBtn.addEventListener("click",logout);
    function logout()
    {
        sessionStorage.clear()
        window.location.href="login.html"
    }
    fetchMovies();
    fetchTvShows();
    fetchPeople();
})

