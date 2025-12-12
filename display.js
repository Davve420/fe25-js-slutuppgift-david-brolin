import {getSearchData}  from "./lists.js";


async function displayMovies(){
    const { movies, persons } = await getSearchData();
    const container = document.getElementById('container');
    container.innerHTML = ''; 

    // render movies
    movies.forEach(movie => {
        container.appendChild(createMovieCard(movie));
    });

    // render persons
    persons.forEach(person => {
        container.appendChild(createPersonCard(person));
    });
}

function createMovieCard(movie){
    const card = document.createElement(`div`);
    card.className = `moviecard`

    const img = document.createElement('img');
    img.src = movie.poster_path;
    img.alt = movie.title || `poster`;

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const date = document.createElement('p');
    date.textContent = movie.release_date;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    card.append(img, title, date, overview);
    return card;
}


function createPersonCard(person){
    const card = document.createElement(`div`);
    card.className = `personcard`

    console.log(person)

    const img = document.createElement('img');
    img.src = person.profile_path;
    img.alt = person.title ?? `profile`;

    const name = document.createElement('h3');
    name.textContent = person.name;

    const department = document.createElement('p');
    department.textContent = person.known_for_department;

    console.log(person.known_for);

    const top3 = document.createElement('ul');
    //fråga om ?? skulle vara bättre än ||
    (person.known_for || []).slice(0, 3).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title || item.name || 'Unknown';
        top3.appendChild(li);
    });

    card.append(img, name, department, top3);
    return card;
}

displayMovies()
// gör en ny fil som renderar och bygger upp sidan. 