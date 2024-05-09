import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TablePagination, Button} from '@mui/material';
import usePaginationLogic from './tableUtils/PaginationControl';
import SearchBar from './tableUtils/Search';
import SetPageComponent from './tableUtils/SetPageComponent';
import axios from 'axios';
import { formatOnlyDate } from './tableUtils/dateUtils';
import useSearchLogic from './tableUtils/SearchControl';

const UsersTable = () => {
    const [data, setData] = useState<any[]>([]);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get<any>('http://localhost:3001/admin');
          setData(response.data.usersList);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
  
    const handleDeleteUser = async (id:string) => {
      try {
        await axios.delete(`http://localhost:3001/admin/${id}`);
        setData(data.filter((user) => user.id !== id)); 
      } catch (error: any) {
        console.error(error);
      }
    };

  const { searchTerm, setSearchTerm, filteredData } = useSearchLogic({ data: data });

  const {
    page,
    setPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage
} = usePaginationLogic();



  return (
    <Box padding={1}>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nr.</TableCell>
              <TableCell>Data zatrudnienia</TableCell>
              <TableCell>Imie</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rola</TableCell>
              <TableCell>Usun</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{formatOnlyDate(user.created_at)}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.second_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>

                <TableCell>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    Usun
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <SetPageComponent 
        page={page}
        setPage={setPage}
        sortedData={filteredData}
        rowsPerPage={rowsPerPage} 
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default UsersTable;