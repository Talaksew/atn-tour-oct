import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./reservedList.css";
import AddIcon from '@mui/icons-material/Add';
import { 
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';

function Pagination({ itemsPerPage, totalItems, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    console.log('Fetching items from backend...');
    axios.get('http://127.0.0.1:4000/reservedList')
      .then(response => {
        console.log('Items fetched successfully:', response.data);
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:4000/profile', { withCredentials: true });
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
        console.error('Error fetching user info:', error.response ? error.response.data : error.message);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading items: {error.message}</p>;

  return (
    <div>
      <TableContainer  component={Paper} style={{ paddingTop: '4rem' }} sx={{maxHeight:'400px'}}>
        <Table aria-label='simple table' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Special Request</TableCell>
              <TableCell>Request Date</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.specialRequests}</TableCell>
                <TableCell>{row.reservationDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
      //   itemsPerPage={itemsPerPage}
      //   totalItems={data.length}
      //   paginate={paginate}
       />
    </div>
  );
}

export default Users;
