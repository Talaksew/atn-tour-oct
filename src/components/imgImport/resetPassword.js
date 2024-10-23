import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Box, Typography } from '@mui/material';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://196.190.61.158:4000/resetPassword/${token}`, { password });
      setMessage(response.data.message);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error occurred while resetting password');
    }
  };

  return (
    <div>
     <div className="img offer">
      <div className="secContainer">
      <h1>Forgot Password ...</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
       <Box padding="20px" width="300px">  
        <TextField
          name="password"
          fullWidth
          size="small"
          label="Enter new password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText='it is the email address you signup hear'

        /></Box>
        <button type="submit" variant="contained" color="primary">Reset Password</button>
      </form>
      {message && <Typography color="error">{message}</Typography>}
    </div></div>
  );
};

export default ResetPassword;
