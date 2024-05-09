import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TablePagination} from '@mui/material';
import usePaginationLogic from './tableUtils/PaginationControl';
import SearchBar from './tableUtils/Search';
import SetPageComponent from './tableUtils/SetPageComponent';
import axios from 'axios';
import { formatOnlyDate } from './tableUtils/dateUtils';
import useSearchLogic from './tableUtils/SearchControl';

const OrdersTable = () => {
    const [data, setData] = useState<any[]>([]);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/orders');
          setData(response.data.data);
          console.log(response.data.data);
        } catch (error: any) { 
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
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
                            <TableCell>No</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                        ).map((order: any, index: number) => (
                            <TableRow key={order.OrderID}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{order.OrderID}</TableCell>
                                <TableCell>{order.FullName}</TableCell>
                                <TableCell>{formatOnlyDate(order.OrderDate)}</TableCell>
                                <TableCell>{order.OrderStatus}</TableCell>
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

export default OrdersTable;