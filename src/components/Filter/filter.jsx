import React, { useState } from 'react';
import axios from 'axios';
import './filter.css'; // Make sure to create this CSS file

const Filter = ({ onFilter }) => {
  const [activeFilter, setActiveFilter] = useState('All');  // State to track active filter

  const filters = [
    "All",
    "Historical",
    "Cultural",
    "Natural",
    "LandScope",
    "Urban",
    "Modern",
    "Spritual",
    "Ethnic"
 ];

 const handleFilterClick = (filter) => {
  setActiveFilter(filter);  // Update active filter state
  onFilter(filter);         // Trigger the onFilter prop function
};

 return (
  <div className="filter-container">
    {filters.map((filter, index) => (
      <button
        key={index}
         onClick={() => handleFilterClick(filter)}  // Update filter state when clicked
       className={`filter-button ${activeFilter === filter ? 'active' : ''}`}  // Add active class conditionally
        >
     {filter}
      </button>
    ))}
  </div>
);
};

export default Filter;