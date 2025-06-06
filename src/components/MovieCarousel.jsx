import React, { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';


const MovieCarousel = ({ 
  movies = [], 
  onMovieSelect,
  title = "Featured Movies",
  showControls = true,
  itemsPerView = 4
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef(null);

  const maxIndex = Math.max(0, movies.length - itemsPerView);

  useEffect(() => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < maxIndex);
  }, [currentIndex, maxIndex]);

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    }
  };

  const goToIndex = (index) => {
    if (index >= 0 && index <= maxIndex) {
      setCurrentIndex(index);

    }
  };

  const handleMovieSelect = (movie) => {

    if (onMovieSelect) {
      onMovieSelect(movie);
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-carousel movie-carousel--empty">
        <h3>{title}</h3>
        <p>No movies to display</p>
      </div>
    );
  }

  return (
    <div className="movie-carousel">

      <div className="movie-carousel__header">
        <h3 className="movie-carousel__title">{title}</h3>

        {showControls && movies.length > itemsPerView && (
          <div className="movie-carousel__controls">
            <button
              className={`carousel-btn carousel-btn--prev ${!canScrollLeft ? 'carousel-btn--disabled' : ''}`}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Previous movies"
            >
              ←
            </button>
            
            <button
              className={`carousel-btn carousel-btn--next ${!canScrollRight ? 'carousel-btn--disabled' : ''}`}
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Next movies"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="movie-carousel__container">
        <div 
          ref={carouselRef}
          className="movie-carousel__track"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="movie-carousel__item"
              style={{ 
                minWidth: `${100 / itemsPerView}%`,
                maxWidth: `${100 / itemsPerView}%`
              }}
            >
              <MovieCard
                movie={movie}
                onSelect={() => handleMovieSelect(movie)}
                size="medium"
              />
            </div>
          ))}
        </div>
      </div>

      {movies.length > itemsPerView && (
        <div className="movie-carousel__indicators">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'carousel-indicator--active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}  
    </div>
  );
};

export const MiniCarousel = ({ movies, onMovieSelect, maxItems = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayMovies = movies.slice(0, maxItems);

  const nextMovie = () => {
    setCurrentIndex((currentIndex + 1) % displayMovies.length);
  };

  const prevMovie = () => {
    setCurrentIndex(currentIndex === 0 ? displayMovies.length - 1 : currentIndex - 1);
  };

  if (displayMovies.length === 0) return null;

  return (
    <div className="mini-carousel">
      <button className="mini-carousel__btn mini-carousel__btn--prev" onClick={prevMovie}>
        ←
      </button>
      
      <div className="mini-carousel__item">
        <MovieCard
          movie={displayMovies[currentIndex]}
          onSelect={onMovieSelect}
          size="small"
        />
      </div>
      
      <button className="mini-carousel__btn mini-carousel__btn--next" onClick={nextMovie}>
        →
      </button>
    </div>
  );
};

export default MovieCarousel;