import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack, Button, Menu, MenuItem, InputAdornment, TextField } from '@mui/material';
import "./navbar.css";
import { useHistory } from 'react-router-dom';  // For navigation

const Navbar = ({ onSearch }) => {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });
  //const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  // Access the current route
  
    // Check if the current route is home ('/')
  const isHomePage = location.pathname === '/';

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const openProfile = Boolean(anchorElProfile);

  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const openMenu = Boolean(anchorElMenu);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://196.190.61.158:4000/profile', { withCredentials: true });
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

  const handleLogout = async () => {
    try {
      await axios.get('http://196.190.61.158:4000/logout', { withCredentials: true });
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }window.location.reload();
  };
  const handleNavigation = (path) => {
    handleCloseProfile();
    navigate(path);
  };

 //search engine 
 const [query, setQuery] = useState('');
 // Search query input handler
 const handleSearchChange = (e) => {
  setQuery(e.target.value); // Update query as the user types
};

// Perform search when the user submits the form or clicks the search button
const handleSearchSubmit = (e) => {
  e.preventDefault(); // Prevent the default form submission
  if (query.trim()) {
    onSearch(query); // Trigger the search with the current query value
  }
};

// Clear the search input and reset the query
const handleClearSearch = () => {
  setQuery('');
  onSearch(''); // Optionally clear the search results
};

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <h1>African Talent Network</h1>
      </div>

      {/* Conditionally render search bar if on home page */}
      {isHomePage && (
        <div className="navbar__center">
          <form onSubmit={handleSearchSubmit}>
          <div className="navbar__center">
            <input
              type="text"
              placeholder="Search ..."
              value={query} // Controlled input using the query state
              onChange={handleSearchChange} // Update the query as user types
            />
            <Button className="search" type="submit">
              <SearchIcon />
            </Button>
            </div>
          </form>
        </div>
      )}

      <div className="navbar__right">
        <Stack direction="row" spacing={2}>
          <Button
            id="profile-menu"
            color="inherit"
            onClick={handleProfileClick}
            aria-controls={openProfile ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? 'true' : undefined}
          >
            <AccountCircleIcon />
          </Button>
          <Button
            id="main-menu"
            onClick={handleMenuClick}
            aria-controls={openMenu ? 'main-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            aria-label="main-menu"
          >
            <MenuIcon />
          </Button>
        </Stack>

        <Menu
          id="profile-menu"
          anchorEl={anchorElProfile}
          open={openProfile}
          onClose={handleCloseProfile}
          MenuListProps={{ 'aria-labelledby': 'profile-button' }}
        >
          {authState.isAuthenticated ? (
            <>
              <MenuItem onClick={handleCloseProfile}>
                <button onClick={() => navigate('/myreserve')}>My Reserved Lists</button>
              </MenuItem>
              <MenuItem onClick={handleCloseProfile}>
                <button onClick={() => navigate('/profile')}>Profile</button>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
              <button onClick={() => navigate('/')}> Logout </button> </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleCloseProfile}>
                <button onClick={() => navigate('/signup')}>Signup</button>
              </MenuItem>
              <MenuItem onClick={handleCloseProfile}>
                <button onClick={() => navigate('/login')}>Login</button>
              </MenuItem>
            </>
          )}
        </Menu>

        <Menu
          id="main-menu"
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{ 'aria-labelledby': 'menu-button' }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <button onClick={() => navigate('/')}>Home</button>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <button onClick={() => navigate('/about')}>About</button>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <button onClick={() => navigate('/contactus')}>Contact Us</button>
          </MenuItem>

          {authState.isAuthenticated && authState.user && (
          <> 
            {(authState.user.role === 'officers' || authState.user.role === 'admin') && (
              <>
                <MenuItem onClick={handleCloseMenu}>
                  <button onClick={() => navigate('/New')}>New Item</button>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <button onClick={() => navigate('/addhotel')}>New Hotel</button>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <button onClick={() => navigate('/itemsList')}>Items List</button>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <button onClick={() => navigate('/reservedList')}>Reserved List</button>
                </MenuItem>
              </>
            )}
            
            {authState.user.role === 'admin' && (
              <MenuItem onClick={handleCloseMenu}>
                <button onClick={() => navigate('/officers')}>Officers</button>
              </MenuItem>
            )}
          </>
        )}


        </Menu>
      </div>
    </div>
  );
}

export default Navbar;

