import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import Navbar from '../Navbar/navbar';
import Filter from '../Filter/filter';
import axios from "axios";
//import './item.css';

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/system";

const AnimatedCard = styled(Card)({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)"
  }
});

function Item() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
});
const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState('');  // State for search query
const [filter, setFilter] = useState('All');  // State for filter

useEffect(() => {
  const checkAuthStatus = async () => {
      try {
          const response = await axios.get('http://localhost:4000/profile', { withCredentials: true });
          if (response.status === 200) {
              setAuthState({
                  isAuthenticated: true,
                  user: response.data,
              });
          } else {
              setAuthState({
                  isAuthenticated: false,
                  user: null,
              });
          }
      } catch (error) {
          console.error('Error checking authentication:', error.message);
          setAuthState({
              isAuthenticated: false,
              user: null,
          });
      }
  };

  checkAuthStatus();

  const authCheckInterval = setInterval(checkAuthStatus, 10 * 60 * 1000); 

  return () => clearInterval(authCheckInterval);
}, []);

  const handleViewDetail = (item) => {
    navigate(`/detail/${item._id}`);
  };

  const handleReserveItem = (item) => {
    navigate(`/reserve/${item._id}`);
  };
   const handleEditItem = (item) => {
     navigate(`/edit/${item._id}`);
   };

  // Function to handle search from Navbar
  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/items', {
        params: { q: searchQuery },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle filter from Filter buttons
  const handleFilter = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/items', {
        params: { category },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all items initially when the page loads
  useEffect(() => {
    handleSearch('');
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading items: {error.message}</p>;

  return (
   <div>
    <Navbar onSearch={handleSearch} />
     <Filter onFilter={handleFilter} />
    <Box sx={{ padding: 3 }}>
    
    
     {/* {['officer', 'admin'].includes(item.userRole) && (    */}
    <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
    <Typography variant="h2">Travel with us</Typography>
        <Typography variant="subtitle1">From historical places to exciting events...</Typography>
        
        {!authState.isAuthenticated  && (
          <><Stack spacing={2} sx={{ marginTop: 2 }}>
          <Alert severity="info">You have to login to reserve</Alert>
        </Stack>
        </>)}
      </Box>
                {/* )} */}
                
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item._id}>
            <AnimatedCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius:'8px' }}>
              {item.images && (
                <CardMedia
                  component="img"
                  sx={{ 
                      height: 200,  // Set a fixed height
                      width: '100%',  // Set the width to fill the card
                      objectFit: 'cover'  // Ensure the image covers the container
                    }}
                 image={`http://localhost:4000${item.images[0]}`}
                  alt={item.name}
                />
              )}
              <CardContent x={{ 
                  height: 150,  // Set a fixed height for consistent size
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', // Ensures the content is spaced evenly
                  
                 }}>
                <Typography variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.shortDetail}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                <LocationOnIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">{item.address}</Typography>
              </Box>
              <CardActions sx={{ marginTop: 'auto' }}>
                <button
                  name="viewDetail"
                  className="btngg"
                  onClick={() => handleViewDetail(item)}
                >
                  Detail
                </button>
              <button
                  name="reserveItem"
                  className="btnggadd"
                  onClick={() => handleReserveItem(item)}
                >
                  Reserve
                </button>
                {authState.isAuthenticated && authState.user && (
                  <>
                  {['officer', 'admin'].includes(authState.user.role) && (   
                  <button
                  name="reserveItem"
                  className="btnggadd"
                  onClick={() => handleEditItem(item)}
                 > Edit
                   
                  </button>
                )}    </>
              )}
              </CardActions>
              
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

    </Box></div>
  );
}

export default Item;
