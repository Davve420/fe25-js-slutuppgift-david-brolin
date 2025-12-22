import { performSearch, displayMovieLists, showDefaultView, displayNowPlayingCarousel, displayError } from './display.js';

const searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = document.querySelector('#search').value.trim();
    if (!searchTerm) return;
    performSearch(searchTerm);
});


displayNowPlayingCarousel();

displayMovieLists('popular');

document.getElementById('popularBtn').addEventListener('click', () => {
    displayMovieLists('popular');
});

document.getElementById('ratedBtn').addEventListener('click', () => {
    displayMovieLists('top_rated');
});

document.getElementById('homeBtn').addEventListener('click', () => {
    showDefaultView();
    document.querySelector('#search').value = ''; 
});


