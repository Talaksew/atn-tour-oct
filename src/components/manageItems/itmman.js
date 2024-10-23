import { useEffect, useMemo, useState, useCallback } from 'react';
import { Avatar, Box, Tooltip, Typography, IconButton } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { grey } from '@mui/material/colors';

const ItemsList = ({ setSelectedLink, link }) => {
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Assume this is fetched from context or API
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);

  // Fetch items on component mount
  useEffect(() => {
    if (typeof setSelectedLink === 'function') {
      setSelectedLink(link);
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://196.190.61.158:4000/manage_items');
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch items: ' + err.message);
        console.error('Fetch error:', err);
      }
    };

    fetchItems();
  }, [link, setSelectedLink]);

  // Memoize column definitions
  const columns = useMemo(() => [
    {
      field: 'images',
      headerName: 'Photo',
      width: 70,
      renderCell: (params) => (
        <Avatar src={params.row.images[0]} variant="rounded" />
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

  const handleEdit = useCallback((id) => {
    console.log("Editing item with ID:", id);
  }, []);

  const handleDelete = useCallback((id) => {
    console.log("Deleting item with ID:", id);
  }, []);

  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ height: 400, width: '100%', fontFamily: "'Open Sans', 'Arial'" }}>
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        Manage Items
      </Typography>
      <DataGrid
        fixedHeader
        columns={columns}
        rows={items} // Filter by user role here if needed
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) => theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default ItemsList;