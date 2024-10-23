import React, { useState, useEffect } from 'react';
import './officers2.css';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 90, editable: false },
    { field: 'firstName', headerName: 'Name', width: 100, editable: true },
    { field: 'username', headerName: 'Email', width: 100, editable: true },
    { field: 'phone', headerName: 'Phone Number', width: 100, editable: true },
    { field: 'role', headerName: 'Role', width: 100, editable: true }
  ];

  useEffect(() => {
    axios.get('http://196.190.61.158:4000/users_view')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getRowId = (row) => row._id;

  const handleRowEdit = (newRow, oldRow) => {
    return new Promise((resolve, reject) => {
      axios.put(`http://196.190.61.158:4000/users_view/${oldRow.id}`, newRow)
        .then((response) => {
          const updatedRows = [...data];
          const index = oldRow.tableData.id;
          updatedRows[index] = newRow;
          setData(updatedRows);
          resolve();
        })
        .catch((error) => {
          console.error("Error updating row:", error);
          reject();
        });
    });
  };

  const handleAddRow = () => {
    const newRow = {
      firstName: 'New Name',
      username: 'newemail@example.com',
      phone: '1234567890',
      role: 'New Role'
    };

    axios.post('http://196.190.61.158:4000/users_view', newRow)
      .then((response) => {
        setData([...data, response.data]);
      })
      .catch((error) => {
        console.error("Error adding row:", error);
      });
  };

  const handleDeleteRow = () => {
    if (selectedRows.length > 0) {
      const rowToDelete = selectedRows[0];  // Deleting the first selected row
      axios.delete(`http://196.190.61.158:4000/users_view/${rowToDelete.id}`)
        .then(() => {
          setData(data.filter(row => row.id !== rowToDelete.id));
        })
        .catch((error) => {
          console.error("Error deleting row:", error);
        });
    }
  };

  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <h4 align="center">MUI DataGrid Bulk Update</h4>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          getRowId={getRowId}
          onProcessRowUpdate={handleRowEdit}
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          components={{
            Toolbar: () => (

              <div style={{ padding: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                >
                  Add New Row
                </Button>
                {selectedRows.length > 0 && (
                  <IconButton
                    color="secondary"
                    onClick={handleDeleteRow}
                    style={{ marginLeft: '10px' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}

export default App;
