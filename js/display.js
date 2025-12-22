import {getMovieLists, getSearchData}  from "./get-API-data.js";

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
    
    // Store number of UNIQUE movies
    carousel.dataset.totalMovies = movies.length;
    
    // Duplicate movies 2x for infinite loop effect
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
    
    // Get card width and gap before carousel starts
    const getCardWidth = () => {
        return cards[0].offsetWidth;
    };
    
    const cardWidth = getCardWidth();
    const gap = 40; // Space between cards matching CSS --card-gap variable
    
    // LOOP BOUNDARIES - Only loop between these indices!
    const startLoopIndex = 3;                 // Index 4 (starts at film 4)
    const endLoopIndex = totalMovies + 2;    // Index 12 (when totalMovies = 10)
    
    // START INDEX
    let currentIndex = startLoopIndex;
    cards[currentIndex].classList.add('center');
    
    // INITIAL POSITION
    // Center current card by offsetting 2 card widths to the left
    const initialOffset = -currentIndex * (cardWidth + gap) + 2 * (cardWidth + gap);
    carousel.style.transform = `translateX(${initialOffset}px)`;
    
    setInterval(() => {
        cards[currentIndex].classList.remove('center');
        
        // Next index - BUT ONLY WITHIN BOUNDARIES!
        currentIndex++;
        if (currentIndex > endLoopIndex) {
            currentIndex = startLoopIndex;  // Loop back
        }
        
        cards[currentIndex].classList.add('center');
        
        const offset = -currentIndex * (cardWidth + gap) + 2 * (cardWidth + gap);
        
        // If we looped back, reset position without animation
        if (currentIndex === startLoopIndex) {
            // Reset position without animation after anime.js duration completes (800ms)
            setTimeout(() => {
                carousel.style.transform = `translateX(${offset}px)`;
            }, 800);
        } else {
            // Otherwise animate smoothly, ref: https://animejs.com/documentation/
            anime({
                targets: carousel,
                translateX: offset,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    }, 3000); // Slide to next card every 3 seconds
}

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


export async function performSearch(searchInput){
    try{
        showSearchView(); 
        document.getElementById('headerTitle').textContent = `${searchInput}`;
        const { movies, persons } = await getSearchData(searchInput);
        
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
    movies.forEach(m => container.appendChild(createMovieCard(m))); 
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
    
    const type = document.createElement('h3');
    type.textContent = 'Movie';

    const img = document.createElement('img');
    img.src = movie.poster_path || './images/default-poster.svg';
    img.alt = movie.title || `poster`;

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const date = document.createElement('p');
    date.textContent = movie.release_date;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    if (showOverview && movie.overview) {
        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        card.append(type, img, title, date, overview);
    } else {
        card.append(img, title, date);
    }

    return card;
}


function createPersonCard(person){
    const card = document.createElement(`div`);
    card.className = `personcard`

    const type = document.createElement('h3');
    type.textContent = 'Person';

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

    card.append(type, img, name, department, top3);
    return card;
}

export function displayError(errorMessage){
    const h1Error = document.querySelector("#error");
    h1Error.innerText = errorMessage;
    h1Error.style.display = 'block';
    
    // Hide error after 5 seconds so it doesn't show after reload
    setTimeout(() => {
        h1Error.style.display = 'none';
    }, 5000); 
}
