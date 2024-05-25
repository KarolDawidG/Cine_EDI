import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TablePagination, Select, MenuItem, Button } from '@mui/material';
import usePaginationLogic from './tableUtils/PaginationControl';
import SearchBar from './tableUtils/Search';
import SetPageComponent from './tableUtils/SetPageComponent';
import axios from 'axios';
import { formatOnlyDate } from './tableUtils/dateUtils';
import useSearchLogic from './tableUtils/SearchControl';
import { BACKEND } from '../../../utils/linkt';
import { notify } from '../../../notification/Notify';

const OrdersTable = () => {
    const [data, setData] = useState<any[]>([]);
    const [newStatus, setNewStatus] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BACKEND}/orders`);
                setData(response.data.data);
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

    const handleStatusChange = (orderId: number, status: string) => {
        setNewStatus(prevStatus => ({
            ...prevStatus,
            [orderId]: status
        }));
    };

    const changeStatus = async (orderId: number, status: string) => {
        try {
            const response = await axios.put(`${BACKEND}/orders/${orderId}/${status}`);
            notify(response.data.message);
        } catch (error) {
            console.error(`Error updating status for OrderID: ${orderId}`, error);
        }
    };

    const confirmStatusChange = (orderId: number) => {
        const status = newStatus[orderId];
        if (status) {
            changeStatus(orderId, status);
            setData(prevData =>
                prevData.map(order =>
                    order.OrderID === orderId ? { ...order, OrderStatus: status } : order
                )
            );
            setNewStatus(prevStatus => {
                const { [orderId]: _, ...rest } = prevStatus;
                return rest;
            });
        }
    };

    return (
        <Box padding={1}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Confirm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredData
                        ).map((order: any, index: number) => (
                            <TableRow key={order.OrderID}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{order.OrderID}</TableCell>
                                <TableCell>{order.FullName}</TableCell>
                                <TableCell>{formatOnlyDate(order.OrderDate)}</TableCell>
                                <TableCell>
                                    <Select
                                        value={newStatus[order.OrderID] || order.OrderStatus}
                                        onChange={(e) => handleStatusChange(order.OrderID, e.target.value as string)}
                                    >
                                        <MenuItem value="paid">Paid</MenuItem>
                                        <MenuItem value="returned">Returned</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => confirmStatusChange(order.OrderID)}>Confirm</Button>
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

export default OrdersTable;
