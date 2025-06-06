import React, { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import RecommendationList from './components/RecommendationList.jsx';
import MovieCarousel from './components/MovieCarousel.jsx';
import { useMovieData } from './utils/dataLoader.js';
import { searchMovies, filterByGenre, sortMovies, getUniqueGenres } from './utils/movieUtils.js';
import { getRecommendations, getPopularMovies } from './utils/recommendations.js';
import './styles/App.css';

function App() {
  const { movies, loading: dataLoading, error: dataError } = useMovieData();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (movies.length > 0) {
      const uniqueGenres = getUniqueGenres(movies);
      setGenres(uniqueGenres);
      setFilteredMovies(movies);
    }
  }, [movies]);

  useEffect(() => {
    if (movies.length === 0) return;
    let result = movies;
    if (searchTerm) {
      result = searchMovies(result, searchTerm);
    }
    if (selectedGenre !== 'all') {
      result = filterByGenre(result, selectedGenre);
    }
    result = sortMovies(result, sortBy);
    setFilteredMovies(result);
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setError(null);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setError(null);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleMovieSelect = async (movie) => {
    setLoading(true);
    setError(null);
    
    try {
      setSelectedMovie(movie);
      const recommendationResults = getRecommendations(movies, movie.id, 5);
      setRecommendations(recommendationResults);
      
      setTimeout(() => {
        const recommendationsSection = document.getElementById('recommendations-section');
        if (recommendationsSection) {
          recommendationsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
      
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSelection = () => {
    setSelectedMovie(null);
    setRecommendations([]);
    setSearchTerm('');
    setSelectedGenre('all');
  };

  if (dataLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <h1>🎬 Movie Recommender</h1>
          <p>Loading movie database...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="app">
        <div className="error-screen">
          <h1>🎬 Movie Recommender</h1>
          <p>Error loading movie database: {dataError}</p>
          <p>Using sample data instead.</p>
        </div>
      </div>
    );
  }

  const popularMovies = getPopularMovies(movies, 8);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">🎬 Movie Recommender</h1>
          <p className="app-subtitle">
            Discover your next favorite movie from {movies.length} examples.
          </p>
        </div>
      </header>

      <section className="carousel-section">
        <div className="container">
          <MovieCarousel 
            movies={popularMovies} 
            onMovieSelect={handleMovieSelect}
          />
        </div>
      </section>

      <section className="controls-section">
        <div className="container">
          <div className="controls-grid">
            <SearchBar 
              searchTerm={searchTerm}
              onSearch={handleSearch}
              placeholder="Search movies by title, genre, or description..."
            />
            
            <div className="filter-group">
              <label htmlFor="genre-select">Genre:</label>
              <select 
                id="genre-select"
                value={selectedGenre} 
                onChange={(e) => handleGenreChange(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="filter-select"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
                <option value="year">Release Year</option>
              </select>
            </div>

            {(selectedMovie || searchTerm || selectedGenre !== 'all') && (
              <button 
                onClick={handleResetSelection}
                className="reset-button"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message">
          <div className="container">
            <p>{error}</p>
          </div>
        </div>
      )}

      {selectedMovie && (
        <section id="recommendations-section" className="recommendations-section">
          <div className="container">
            <div className="selected-movie">
              <h2>Selected Movie</h2>
              <MovieCard 
                movie={selectedMovie} 
                isSelected={true}
                showFullDescription={true}
              />
            </div>
            
            {loading ? (
              <div className="loading">
                <p>Generating recommendations...</p>
                <div className="spinner"></div>
              </div>
            ) : (
              <RecommendationList 
                recommendations={recommendations}
                onMovieSelect={handleMovieSelect}
              />
            )}
          </div>
        </section>
      )}

      <section className="movies-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {searchTerm ? `Search Results (${filteredMovies.length})` : 'All Movies'}
            </h2>
            <p>{filteredMovies.length} movies found</p>
          </div>
          
          {filteredMovies.length === 0 ? (
            <div className="no-results">
              <p>No movies found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="movies-grid">
              {filteredMovies.slice(0, 100).map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelect={() => handleMovieSelect(movie)}
                  isSelected={selectedMovie?.id === movie.id}
                />
              ))}
              {filteredMovies.length > 100 && (
                <div className="load-more">
                  <p>Showing first 100 results. Use search or filters to narrow down.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Movie Recommender.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;