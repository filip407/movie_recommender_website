export const searchMovies = (movies, searchTerm) => {
    if (!searchTerm.trim()) return movies;
    
    const term = searchTerm.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(term) ||
      movie.genre.toLowerCase().includes(term) ||
      (movie.overview && movie.overview.toLowerCase().includes(term))
    );
  };

  export const filterByGenre = (movies, genre) => {
    if (!genre || genre === 'all') return movies;
    
    return movies.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  };

  export const sortMovies = (movies, sortBy) => {
    const moviesCopy = [...movies];
    
    switch (sortBy) {
      case 'title':
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return moviesCopy.sort((a, b) => b.vote_average - a.vote_average);
      case 'popularity':
        return moviesCopy.sort((a, b) => b.popularity - a.popularity);
      case 'year':
        return moviesCopy.sort((a, b) => 
          new Date(b.release_date) - new Date(a.release_date)
        );
      default:
        return moviesCopy;
    }
  };

  export const getUniqueGenres = (movies) => {
    const genresSet = new Set();
    
    movies.forEach(movie => {
      if (movie.genre) {
        movie.genre.split(',').forEach(genre => {
          genresSet.add(genre.trim());
        });
      }
    });
    
    return Array.from(genresSet).sort();
  };

export const fetchMoviePoster = async (movieId) => {
  const apiKey = "c7ec19ffdd3279641fb606d19ceb9bb1";
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.poster_path) {
      return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    }
    return '/placeholder-movie.jpg';
  } catch (error) {
    console.error('Error fetching poster:', error);
    return '/placeholder-movie.jpg';
  }
};

  export const getMovieYear = (releaseDate) => {
    if (!releaseDate) return 'N/A';
    return new Date(releaseDate).getFullYear();
  };

  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  export const formatRating = (rating) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  export const validateMovie = (movie) => {
    const errors = [];
    
    if (!movie.id) errors.push('ID is required');
    if (!movie.title || movie.title.trim() === '') errors.push('Title is required');
    if (movie.vote_average && (movie.vote_average < 0 || movie.vote_average > 10)) {
      errors.push('Vote average must be between 0 and 10');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };