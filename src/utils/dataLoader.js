export const loadMoviesFromCSV = async () => {
    try {

      const response = await fetch('/dataset.csv');
      const csvText = await response.text();

      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
      
      console.log('CSV Headers:', headers);
      
      const movies = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; 

        const values = parseCSVLine(line);
        
        if (values.length >= headers.length) {
          const movie = {};
          headers.forEach((header, index) => {
            let value = values[index] || '';

            switch(header) {
              case 'id':
              case 'vote_count':
                movie[header] = parseInt(value) || 0;
                break;
              case 'popularity':
              case 'vote_average':
                movie[header] = parseFloat(value) || 0;
                break;
              default:
                movie[header] = value.replace(/"/g, '').trim();
            }
          });

          if (movie.id && movie.title) {
            movies.push(movie);
          }
        }
      }
      
      console.log(`Successfully loaded ${movies.length} movies from CSV`);
      return movies;
      
    } catch (error) {
      console.error('Error loading CSV:', error);
      return []; 
    }
  };
  

  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  };

  import { useState, useEffect } from 'react';
  
  export const useMovieData = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const movieData = await loadMoviesFromCSV();
          setMovies(movieData);
          setError(null);
        } catch (err) {
          console.error('Failed to load movie data:', err);
          setError('Failed to load movie data');
          return []; 
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }, []);
    
    return { movies, loading, error };
  };