import {options} from "./config.js"
//try catch för API status koder !respone.ok (kolla objektets innehåll)
export async function getMovieLists(selectedValue){
    try{

        const response = await fetch(`https://api.themoviedb.org/3/movie/${selectedValue}?language=en-US&page=1`, options)
        if(!response.ok){
            throw new Error(`Status code 404: API error`);
        }

    const resData = await response.json();

    console.log('getMovieLists response', resData);

    const chosenData = resData.results.map(movie => ({
        title: movie.original_title,
        poster_path: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        release_date: movie.release_date
    })).toSpliced(10,19);
    console.log(chosenData);
    return chosenData;
}
catch(error){
    throw error;
}
}
// try catch status kod
export async function getSearchData(searchInput){
    try{
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(searchInput)}&include_adult=false&language=en-US&page=1`, options)
    console.log(searchRes)

    if(!searchRes.ok){
        throw new Error("Server issue: status code 404");
    }
    const searchData = await searchRes.json();
    console.log(searchData);
    
    //Building a new list with the displayed properties for movies based on the search    
    const movies = searchData.results
    .filter(movie => movie.media_type === 'movie' )
    .map( search =>{
                return{
                title: search.original_title,
                release_date: search.release_date,
                poster_path: search.poster_path ? "https://image.tmdb.org/t/p/w200" + search.poster_path : null,
                overview: search.overview
            }}).filter(Boolean);


    //Building a new list based on the search with the displayed properties for people (persons)
    const persons = searchData.results
    .filter(person => person.media_type === 'person')
    .map( search =>{
        return{
        profile_path: search.profile_path ? "https://image.tmdb.org/t/p/w200" + search.profile_path : null,                
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
    return {movies, persons};
} catch(error){
    console.log(error)
    throw error;
}

}