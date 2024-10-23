import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Avatar, Box, Typography, CircularProgress } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import UsersActions from './userActions'; // Ensure this component is correctly defined

const Users = ({ setSelectedLink, link }) => {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof setSelectedLink === 'function') {
      setSelectedLink(link);
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };

    fetchItems();
  }, [link, setSelectedLink]);
  const columns = useMemo(
    () => [
      {
        field: 'photoURL',
        headerName: 'Avatar',
        width: 60,
        renderCell: (params) => <Avatar src={params.row.photoURL} />,
        sortable: false,
        filterable: false,
      },
      // {
      //   field: 'profile',
      //   headerName: 'Name',
      //   width: 170,
      //   renderCell: (params) => `${params.row.firstName} ${params.row.lastName}`, // or any other combination
      // },
      {
        field: 'profile',
        headerName: 'Name',
        width: 170,
        renderCell: (params) => {
          const firstName = params.row.profile?.firstName || 'No First Name';
          const lastName = params.row.profile?.lastName || 'No Last Name';
          return `${firstName} ${lastName}`;
        },
      },
      
      { field: 'username', headerName: 'Email', width: 200 },
      {
        field: 'role',
        headerName: 'Role',
        width: 100,
        type: 'singleSelect',
        valueOptions: ['user', 'officer', 'admin'],
        editable: true,
      },
      {
        field: 'active',
        headerName: 'Active',
        width: 100,
        type: 'boolean',
        editable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      { field: '_id', headerName: 'Id', width: 220 },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
        width: 100,
      },
    ],
    [rowId]
  );

  //if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Manage Users
      </Typography>
      <DataGrid
        columns={columns}
        rows={users}
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
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default Users;