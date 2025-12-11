const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjYyYmMzODhiNjk3MzdmZTE2MmQwZjZhNjE5ODk4YyIsIm5iZiI6MTc2NTM3MTM1NS40MTYsInN1YiI6IjY5Mzk2ZGRiM2JiOTA5NGFhZTNjZjFjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._AY0IhBxbHM0fgy0jMJx7z4YVZys1K1jgB-TYp31D8I'
    }
};

fetch('https://api.themoviedb.org/3/configuration', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

const baseUrlImg = `http://image.tmdb.org/t/p/${poster_path}`;

