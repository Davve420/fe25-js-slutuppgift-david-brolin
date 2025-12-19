import { displaySearch, displayMovieLists, showDefaultView, displayNowPlayingCarousel, displayError } from './display.js';

// En enda sökfält-handler
const searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = document.querySelector('#search').value.trim();
    if (!searchTerm) return;
    displaySearch(searchTerm);
});

// 1. Visa Now Playing karusell
displayNowPlayingCarousel().catch(error => {
    console.error('Failed to initialize carousel:', error);
    displayError('Could not load carousel. Please refresh.');
});

// 2. Visa default-lista (Popular som första)
displayMovieLists('popular').catch(error => {
    console.error('Failed to load popular movies:', error);
    displayError('Could not load movies. Please refresh.');
});

// Knapp-handlers
document.getElementById('popularBtn').addEventListener('click', () => {
    displayMovieLists('popular').catch(error => {
        console.error('Failed to load popular movies:', error);
        displayError('Could not load popular movies.');
    });
});

document.getElementById('ratedBtn').addEventListener('click', () => {
    displayMovieLists('top_rated').catch(error => {
        console.error('Failed to load top rated movies:', error);
        displayError('Could not load top rated movies.');
    });
});

// Hem-knapp
document.getElementById('homeBtn').addEventListener('click', () => {
    showDefaultView();
    document.querySelector('#search').value = ''; 
});


