const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjYyYmMzODhiNjk3MzdmZTE2MmQwZjZhNjE5ODk4YyIsIm5iZiI6MTc2NTM3MTM1NS40MTYsInN1YiI6IjY5Mzk2ZGRiM2JiOTA5NGFhZTNjZjFjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._AY0IhBxbHM0fgy0jMJx7z4YVZys1K1jgB-TYp31D8I'
    }
};
console.log("--------->")

async function getTopMovies(){

    //Handling the promise object
    const resPopular = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    const dataPopular = await resPopular.json();

    //Looping through the array to get a new scaled version with the desired properties.
    const popularScaledList = dataPopular.results.map(movie => ({
        title: movie.original_title,
        poster_path: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        release_date: movie.release_date
    }));
    console.log(popularScaledList);
    console.log("Popular---------")

    //Doing the same procedure for the top rated movies.
    const resRated = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    const dataRated = await resRated.json();
    
    const ratedScaledList = dataRated.results.map(movie => ({
        title: movie.original_title,
        poster_path: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        release_date: movie.release_date
    }));
    console.log(ratedScaledList);
    console.log("Rated--------->")

    //Doing the same procedure for the "now playing" movies.
    const resPlaying = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    const dataPlaying = await resPlaying.json();
    
    const playingScaledList = dataPlaying.results.map(movie => ({
        title: movie.original_title,
        poster_path: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        release_date: movie.release_date
    }));
    console.log(playingScaledList);
    console.log("Playing--------->")
}


export async function getSearchData(){
    let searchInput = /* hämta search från användare*/ "Tom Hanks"  //Matthew Steven LeBlanc , för att se tv
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchInput}&include_adult=false&language=en-US&page=1`, options)
    const searchData = await searchRes.json();
    console.log(searchData);
    
    //Building a new list based on the search with the displayed properties for movies   
    const movies = searchData.results
    .filter(movie => movie.media_type === 'movie' )
    .map( search =>{
                return{
                title: search.original_title,
                release_date: search.release_date,
                poster_path: "https://image.tmdb.org/t/p/w200" + search.poster_path,
                overview: search.overview
            }}).filter(Boolean);
            console.log(movies)


    //Building a new list based on the search with the displayed properties for people (persons)
    const persons = searchData.results
    .filter(person => person.media_type === 'person')
    .map( search =>{
        return{
            profile_path: "https://image.tmdb.org/t/p/w200" + search.profile_path,
                name: search.name,
                known_for_department: search.known_for_department,
                known_for: search.known_for.map(item => {
                    return{
                        name: item.name,
                        title: item.title,
                        media_type: item.media_type
                    }
                })
        }}).filter(Boolean);
        console.log(persons);
        return {movies, persons};
}



    //getSearchData();
    //getTopMovies().then()
    //.catch(err => console.error(err));


const prop1 = 'lalalalallal';
const prop2 = 'loolololoo';

// const obj = {
//     prop1: prop1,
//     prop2: prop2
// }
const obj = { prop1, prop2}
console.log(obj)

const obj2 = {
    ett: 11111,
    tva: 22222
}
// const ett = obj2.ett;
// const tva = obj2.tva;
const {ett, tva } = obj2;

console.log(ett, tva)