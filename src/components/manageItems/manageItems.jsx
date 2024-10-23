import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Pagination } from '@mui/material';

const ItemsList = ({ setSelectedLink, link }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://196.190.61.158:4000/manage_items')
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://196.190.61.158:4000/profile', { withCredentials: true });
        setAuthState({ isAuthenticated: true, user: response.data });
      } catch (error) {
        setAuthState({ isAuthenticated: false, user: null });
      }
    };
    fetchUserInfo();
  }, []);

  const handleEdit = (id) => {
    console.log('Editing item with id:', id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://196.190.61.158:4000/manage_items/${id}`)
      .then(response => {
        setItems((prevItems) => prevItems.filter(item => item._id !== id));
      })
      .catch(err => {
        console.error('Error deleting item:', err);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    const updatedItems = items.map((item) => 
      item._id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);

    axios.put(`http://127.0.0.1:4000/manage_items/${id}`, { [field]: value })
      .then(() => {
        console.log(`Item ${id} updated successfully`);
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  };


  const columns = useMemo(() => [
    {
      field: 'images',
      headerName: 'Photo',
      width: 70,
      renderCell: (params) => (
        <Avatar src={params.row.images?.[0]} variant="rounded" />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'price',
      headerName: 'Cost',
      width: 70,
      renderCell: (params) => '$' + params.row.price,
    },
    { field: 'name', headerName: 'Title', width: 100 },
    { field: 'address', headerName: 'Address', width: 110 },
    { field: 'shortDetail', headerName: 'Description', width: 200 },
    {
      field: 'uName',
      headerName: 'Added by',
      width: 80,
      renderCell: (params) => (
        <Tooltip title={params.row.uName || 'Unknown'}>
          <Avatar src={params.row.uPhoto || '/default-avatar.jpg'} />
        </Tooltip>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      renderCell: (params) => moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    { field: '_id', hide: true },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ], []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading items: {error.message}</p>;

  return (
    <div>  
      <h1 align="center">React-App</h1>
      <h4 align="center">MUI DataGrid Bulk Update</h4>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={currentItems}
          columns={columns}
          pageSize={itemsPerPage}
          rowsPerPageOptions={[itemsPerPage]}
          onCellEditCommit={handleCellEditCommit}
          disableSelectionOnClick
          checkboxSelection
          pagination
          getRowId={(row) => row._id}
        />
      </Box>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(items.length / itemsPerPage)}
        page={currentPage}
        onChange={(event, value) => paginate(value)}
        color="primary"
      />
    </div>
  );
};

export default ItemsList;
