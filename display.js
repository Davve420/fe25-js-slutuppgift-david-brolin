import {getMovieLists, getSearchData}  from "./lists.js";

// Karusell — ALLTID Now Playing
export async function displayNowPlayingCarousel(){
    try {
        const chosenData = await getMovieLists('now_playing');
        renderCarousel(chosenData);
        startCarousel();
    } catch(error){
        console.error('Error loading carousel:', error);
        displayError(`Could not load carousel. Please refresh the page.`);
    }
}

function renderCarousel(movies){
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';
    
    // Lagra antal UNIKA filmer
    carousel.dataset.totalMovies = movies.length;
    
    // Duplicera filmerna 2x för infinite loop-effekt
    // [film0, film1, ... film9, film0, film1, ... film9]
    const doubledMovies = [...movies, ...movies];
    
    doubledMovies.forEach(m => {
        carousel.appendChild(createMovieCard(m, false));
    });
}

function startCarousel(){
    const carousel = document.getElementById('carousel');
    const cards = carousel.querySelectorAll('.movieCard');
    const totalMovies = parseInt(carousel.dataset.totalMovies);
    
    if (cards.length < 1) return;
    
    // Få kort-bredd och gap INNAN vi startar
    const getCardWidth = () => {
        return cards[0].offsetWidth;
    };
    
    const cardWidth = getCardWidth();
    const gap = 40;
    
    // LOOP BOUNDARIES - Bara loop mellan dessa index!
    const startLoopIndex = 3;                 // Index 3 (startar på film 3)
    const endLoopIndex = totalMovies + 2;    // Index 12 (när totalMovies = 10)
    
    // START INDEX
    let currentIndex = startLoopIndex;
    cards[currentIndex].classList.add('center');
    
    // INITIAL POSITION
    const initialOffset = -currentIndex * (cardWidth + gap) + 2 * (cardWidth + gap);
    carousel.style.transform = `translateX(${initialOffset}px)`;
    
    setInterval(() => {
        cards[currentIndex].classList.remove('center');
        
        // Nästa index - MEN BARA INOM BOUNDARIES!
        currentIndex++;
        if (currentIndex > endLoopIndex) {
            currentIndex = startLoopIndex;  // Loopa tillbaka
        }
        
        cards[currentIndex].classList.add('center');
        
        const offset = -currentIndex * (cardWidth + gap) + 2 * (cardWidth + gap);
        
        // Om vi loopade tillbaka, animera från gamla position först
        if (currentIndex === startLoopIndex) {
            // Reset position UTAN animation
            setTimeout(() => {
                carousel.style.transform = `translateX(${offset}px)`;
            }, 800);
        } else {
            // Annars animera smooth
            anime({
                targets: carousel,
                translateX: offset,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    }, 3000);
}


// Listor — Popular eller Top Rated (ENDAST via knappar)
export async function displayMovieLists(selectedValue){
    try {
        const chosenData = await getMovieLists(selectedValue);
        
        const title = selectedValue === 'popular' ? 'Popular Movies' : 'Top Rated Movies';
        document.getElementById('listTitle').textContent = title;
        renderMovieLists(chosenData);
    } catch(error){
        console.error('Error loading movie list:', error);
        displayError(`Could not load movies. Please try again.`);
    }
}

function renderMovieLists(movies){
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';
    movies.forEach(m => listContainer.appendChild(createMovieCard(m, false)));
}


export async function displaySearch(searchInput){
    try{
        showSearchView(); // visa search-vy
        document.getElementById('headerTitle').textContent = `${searchInput}`;
        console.log('displaySearch called with', searchInput);
        const { movies, persons } = await getSearchData(searchInput);
        
        // Kolla om sökresultatet är tomt
        if (movies.length === 0 && persons.length === 0) {
            displayNoResults(searchInput);
            return;
        }
        
        renderSearchResults(movies, persons);
    }catch(error){
        console.error('Error during search:', error);
        displayError(`Search failed. Please try again.`);
    }
}

function showSearchView(){
    document.getElementById('defaultView').style.display = 'none';
    document.getElementById('searchView').style.display = 'block';
}

export function showDefaultView(){
    document.getElementById('defaultView').style.display = 'block';
    document.getElementById('searchView').style.display = 'none';
    document.getElementById('headerTitle').textContent = 'Now Playing in Cinemas';
}

function renderSearchResults(movies, persons){
    const container = document.getElementById('container');
    container.innerHTML = '';
    persons.forEach(p => container.appendChild(createPersonCard(p)));
    movies.forEach(m => container.appendChild(createMovieCard(m))); // (default showOverview = true)
}

function displayNoResults(searchTerm){
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'noResults';
    noResultsDiv.innerHTML = `
        <h2>No results found for "${searchTerm}"</h2>
        <p>Check spelling or try searching for something else</p>
    `;
    container.appendChild(noResultsDiv);
}

function createMovieCard(movie, showOverview = true){
    const card = document.createElement(`div`);
    card.className = `movieCard`;
    
    const img = document.createElement('img');
    img.src = movie.poster_path || './images/default-poster.svg';
    img.alt = movie.title || `poster`;

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const date = document.createElement('p');
    date.textContent = movie.release_date;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    // If there is no overview or no overview wanted, none will be displayed.
    if (showOverview && movie.overview) {
        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        card.append(img, title, date, overview);
    } else {
        card.append(img, title, date);
    }

    return card;
}


function createPersonCard(person){
    const card = document.createElement(`div`);
    card.className = `personcard`

    const img = document.createElement('img');
    img.src = person.profile_path || './images/default-avatar.svg'; //Using a default Avatar if there is none provided by the API, from (https://heroicons.com/)
    img.alt = person.name || `profile`;

    const name = document.createElement('h3');
    name.textContent = person.name;

    const department = document.createElement('p');
    department.textContent = person.known_for_department;

    const top3 = document.createElement('ul');
    (person.known_for || []).slice(0, 3).forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.media_type === 'tv' ? 'TV' : 'Movie'}: ${item.title || item.name}`;
        top3.appendChild(li);
    });

    card.append(img, name, department, top3);
    return card;
}

export function displayError(errorMessage){
    const h1Error = document.querySelector("#error");
    h1Error.innerText = errorMessage;
    h1Error.style.display = 'block';
    
    // Dölj error efter 5 sekunder
    setTimeout(() => {
        h1Error.style.display = 'none';
    }, 5000);
}


// gör en ny fil som renderar och bygger upp sidan.