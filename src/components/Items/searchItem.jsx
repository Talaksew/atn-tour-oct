import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  // Extract the query string from the URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    // Fetch search results based on the query parameter
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await axios.get(`http://196.190.61.158:4000/search?q=${query}`);
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchSearchResults();
  }, [query]); // Re-run the effect when query changes

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchPage;
