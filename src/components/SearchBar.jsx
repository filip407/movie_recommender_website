import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ 
  searchTerm, 
  onSearch, 
  placeholder = "Search movies..."
}) => {
  const [inputValue, setInputValue] = useState(searchTerm || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setInputValue('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className={`search-input-container ${isFocused ? 'search-input-container--focused' : ''}`}>
          <div className="search-icon">
            🔍
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="search-input"
            aria-label="Search movies"
            autoComplete="off"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="search-submit"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;