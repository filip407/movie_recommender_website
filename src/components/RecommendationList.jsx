import React from 'react';
import MovieCard from './MovieCard';

const RecommendationList = ({ 
  recommendations = [], 
  onMovieSelect,
  title = "Recommended Movies",
  showSimilarityScore = true,
  layout = 'grid'
}) => {
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendation-list recommendation-list--empty">
        <h3>{title}</h3>
        <div className="empty-state">
          <div className="empty-state__icon">🎭</div>
          <p className="empty-state__message">
            No recommendations available. Select a movie to get personalized suggestions!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`recommendation-list recommendation-list--${layout}`}>
      <div className="recommendation-list__header">
        <h3 className="recommendation-list__title">{title}</h3>
        <p className="recommendation-list__subtitle">
          Based on content similarity • {recommendations.length} suggestions
        </p>
      </div>

      <div className="recommendation-list__content">
        {recommendations.map((recommendation, index) => {
          const { movie, similarity, reasons } = recommendation;
          
          return (
            <div key={movie.id} className="recommendation-item">

              <div className="recommendation-item__rank">
                #{index + 1}
              </div>

              <div className="recommendation-item__card">
                <MovieCard
                  movie={movie}
                  onSelect={onMovieSelect}
                  size="medium"
                  showFullDescription={false}
                />
              </div>

              <div className="recommendation-item__details">
                {showSimilarityScore && similarity !== undefined && (
                  <div className="recommendation-item__score">
                    <div className="score-bar">
                      <div 
                        className="score-bar__fill"
                        style={{ width: `${similarity * 100}%` }}
                      ></div>
                    </div>
                    <span className="score-text">
                      {Math.round(similarity * 100)}% match
                    </span>
                  </div>
                )}

                {reasons && (
                  <div className="recommendation-item__reasons">
                    <span className="reasons-label">Why this match:</span>
                    <span className="reasons-text">{reasons}</span>
                  </div>
                )}

                <div className="recommendation-item__stats">
                  {movie.vote_average > 0 && (
                    <span className="stat">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                  {movie.release_date && (
                    <span className="stat">
                      📅 {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                  {movie.genre && (
                    <span className="stat">
                      🎭 {movie.genre.split(',')[0].trim()}
                    </span>
                  )}
                </div>

                <button
                  className="recommendation-item__action"
                  onClick={() => onMovieSelect && onMovieSelect(movie)}
                  aria-label={`Get recommendations for ${movie.title}`}
                >
                  More like this →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recommendation-list__actions">
        <button 
          className="btn btn--secondary"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </button>
        
        <div className="recommendation-list__info">
          <p>
            💡 <strong>Tip:</strong> Click on any recommended movie to discover more films like it!
          </p>
        </div>
      </div>
    </div>
  );
};

export const QuickRecommendations = ({ recommendations, onMovieSelect, maxItems = 3 }) => {
  const limitedRecommendations = recommendations.slice(0, maxItems);

  if (limitedRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="quick-recommendations">
      <h4>Quick Picks</h4>
      <div className="quick-recommendations__list">
        {limitedRecommendations.map((rec, index) => (
          <div 
            key={rec.movie.id} 
            className="quick-recommendation"
            onClick={() => onMovieSelect && onMovieSelect(rec.movie)}
          >
            <span className="quick-recommendation__rank">#{index + 1}</span>
            <span className="quick-recommendation__title">{rec.movie.title}</span>
            <span className="quick-recommendation__score">
              {Math.round(rec.similarity * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;