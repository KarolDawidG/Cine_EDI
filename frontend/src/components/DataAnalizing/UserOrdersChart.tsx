import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BACKEND } from '../../utils/linkt';
import { Box, Typography, MenuItem, FormControl, Select } from '@mui/material';
import UserChart from './UserChart';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserOrdersChart: React.FC = () => {
  const [userData, setUserData] = useState<{ id: string, first_name: string }[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/analizing/users`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching sales data', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: any) => {
    setUserId(event.target.value as string);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Sales Chart of Individual Users</Typography>
      <FormControl sx={{ marginBottom: 2 }}>
        <Select
          value={userId}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>Select User</em>
          </MenuItem>
          {userData.map((user) => (
            <MenuItem key={user.id} value={user.id}>{user.first_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
        <UserChart userId={userId} />
      </Box>
    </Box>
  );
};

export default UserOrdersChart;
