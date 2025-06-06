import React, { useState, useEffect } from 'react';
import { fetchMoviePoster, formatRating, getMovieYear, truncateText } from '../utils/movieUtils';

const MovieCard = ({ 
  movie, 
  onSelect, 
  isSelected = false, 
  showFullDescription = false,
  size = 'medium'
}) => {
  const [posterUrl, setPosterUrl] = useState('/placeholder-movie.jpg');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadPoster = async () => {
      if (movie.id) {
        try {
          setImageLoading(true);
          const url = await fetchMoviePoster(movie.id);
          setPosterUrl(url);
          setImageError(false);
        } catch (error) {
          console.error('Error loading poster for movie:', movie.id, error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      }
    };

    loadPoster();
  }, [movie.id]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(movie);
    }
  };
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const getCardClasses = () => {
    let classes = ['movie-card', `movie-card--${size}`];
    
    if (isSelected) classes.push('movie-card--selected');
    if (onSelect) classes.push('movie-card--clickable');
    
    return classes.join(' ');
  };

  const getGenresList = () => {
    if (!movie.genre) return [];
    return movie.genre.split(',').map(g => g.trim()).slice(0, 3); 
  };

  return (
    <div className={getCardClasses()} onClick={handleClick}>
      <div className="movie-card__poster">
        {imageLoading && (
          <div className="movie-card__poster-loading">
            <div className="spinner"></div>
          </div>
        )}
        
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="movie-card__image"
          onError={handleImageError}
          onLoad={() => setImageLoading(false)}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
        
        {imageError && (
          <div className="movie-card__poster-fallback">
            <span>🎬</span>
            <p>No Image</p>
          </div>
        )}
        {movie.vote_average > 0 && (
          <div className="movie-card__rating-badge">
            ⭐ {formatRating(movie.vote_average)}
          </div>
        )}
      </div>

      <div className="movie-card__content">

        <h3 className="movie-card__title" title={movie.title}>
          {movie.title}
        </h3>

        {movie.release_date && (
          <p className="movie-card__year">
            {getMovieYear(movie.release_date)}
          </p>
        )}

        {movie.genre && (
          <div className="movie-card__genres">
            {getGenresList().map((genre, index) => (
              <span key={index} className="movie-card__genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <p className="movie-card__overview">
            {showFullDescription 
              ? movie.overview 
              : truncateText(movie.overview, size === 'large' ? 150 : 100)
            }
          </p>
        )}

        <div className="movie-card__stats">
          {movie.vote_average > 0 && (
            <span className="movie-card__stat">
              ⭐ {formatRating(movie.vote_average)}
            </span>
          )}
          
          {movie.vote_count > 0 && (
            <span className="movie-card__stat">
              👥 {movie.vote_count.toLocaleString()}
            </span>
          )}
          
          {movie.popularity > 0 && size === 'large' && (
            <span className="movie-card__stat">
              🔥 {Math.round(movie.popularity)}
            </span>
          )}
        </div>

        {onSelect && size === 'large' && (
          <button 
            className="movie-card__action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
          >
            Get Recommendations
          </button>
        )}
      </div>

      {isSelected && (
        <div className="movie-card__selected-indicator">
          ✓ Selected
        </div>
      )}
    </div>
  );
};

export default MovieCard;