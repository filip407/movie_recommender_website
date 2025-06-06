const processText = (text) => {
    if (!text) return [];

    const cleanText = text.toLowerCase().replace(/[^\w\s]/gi, ' ');

    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'before', 'after', 'above', 'below', 'is', 'are', 'was', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'can', 'his', 'her',
      'him', 'she', 'he', 'it', 'they', 'them', 'their', 'this', 'that',
      'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours'
    ]);
    
    return cleanText
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  };

  const createFeatureVector = (movie) => {
    const overview = movie.overview || '';
    const genre = movie.genre || '';
    const combinedText = overview + ' ' + genre.replace(/,/g, ' ');
    
    return processText(combinedText);
  };

  const calculateCosineSimilarity = (vector1, vector2) => {
    const set1 = new Set(vector1);
    const set2 = new Set(vector2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    
    const magnitude1 = Math.sqrt(vector1.length);
    const magnitude2 = Math.sqrt(vector2.length);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return intersection.size / (magnitude1 * magnitude2);
  };
  
  export const getRecommendations = (movies, selectedMovieId, count = 5) => {
    try {

      const selectedMovie = movies.find(movie => movie.id === selectedMovieId);
      if (!selectedMovie) {
        throw new Error('Movie not found');
      }
      
      const selectedVector = createFeatureVector(selectedMovie);

      const similarities = movies
        .filter(movie => movie.id !== selectedMovieId)
        .map(movie => {
          const movieVector = createFeatureVector(movie);
          const similarity = calculateCosineSimilarity(selectedVector, movieVector);
          
          return {
            movie,
            similarity,
            reasons: getRecommendationReasons(selectedMovie, movie)
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, count);
      
      return similarities;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  };

  const getRecommendationReasons = (selectedMovie, recommendedMovie) => {
    const reasons = [];

    const selectedGenres = selectedMovie.genre ? selectedMovie.genre.split(',').map(g => g.trim()) : [];
    const recommendedGenres = recommendedMovie.genre ? recommendedMovie.genre.split(',').map(g => g.trim()) : [];
    const commonGenres = selectedGenres.filter(genre => recommendedGenres.includes(genre));
    
    if (commonGenres.length > 0) {
      reasons.push(`Shared genres: ${commonGenres.join(', ')}`);
    }
 
    if (selectedMovie.vote_average && recommendedMovie.vote_average) {
      const ratingDiff = Math.abs(selectedMovie.vote_average - recommendedMovie.vote_average);
      if (ratingDiff <= 0.5) {
        reasons.push('Similar rating');
      }
    }
    
    if (selectedMovie.release_date && recommendedMovie.release_date) {
      const selectedYear = new Date(selectedMovie.release_date).getFullYear();
      const recommendedYear = new Date(recommendedMovie.release_date).getFullYear();
      const yearDiff = Math.abs(selectedYear - recommendedYear);
      
      if (yearDiff <= 5) {
        reasons.push('Similar time period');
      }
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Content similarity';
  };

  export const getRecommendationsByGenre = (movies, genre, count = 10) => {
    return movies
      .filter(movie => 
        movie.genre && movie.genre.toLowerCase().includes(genre.toLowerCase())
      )
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, count);
  };

  export const getPopularMovies = (movies, count = 10) => {
    return movies
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, count);
  };

  export const getTopRatedMovies = (movies, count = 10) => {
    return movies
      .filter(movie => movie.vote_average && movie.vote_average > 0)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, count);
  };