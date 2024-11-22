import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import TableToolbar from 'src/components/tables/TableToolbar';
import TableHeadCustom from 'src/components/tables/TableHead';
import BlankCard from 'src/components/shared/BlankCard';
import { HeadCell } from 'src/types/layout/table';
import { useDispatch } from 'src/store/Store';
import { Link as RouterLink } from 'react-router-dom';
import TableRowComponent from '../OrderRow';
import { OrderDto } from 'src/types/apps/order';
import { fetchOrder } from 'src/store/apps/order/OrderSlice';
import { useTranslation } from 'react-i18next';

const OrderView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, totalElements } = useSelector((state: any) => state.orders);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof OrderDto>('id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const headCells: HeadCell[] = [
    // { id: 'orderCode', numeric: true, disablePadding: true, label: '#' },
    { id: 'order', numeric: true, disablePadding: false, label: t('order.order') },
    { id: 'product', numeric: true, disablePadding: false, label: t('order.product') },
    { id: 'pay', numeric: true, disablePadding: false, label: t('order.pay') },
    { id: 'time', numeric: true, disablePadding: false, label: t('order.time') },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/">
      {t('breadcrumbHome')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('order.breadcrumbSub')}
    </Typography>,
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRows = Array.isArray(orders) ? orders : [];

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof OrderDto) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n: OrderDto) => n.orderCode);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = Math.max(0, rowsPerPage - filteredRows.length);

  useEffect(() => {
    dispatch(
      fetchOrder(searchTerm, dateFilter, userName, page, rowsPerPage, orderBy, order.toUpperCase()),
    );
  }, [dispatch, searchTerm, dateFilter, userName, page, rowsPerPage, orderBy, order]);

  return (
    <PageContainer title="Order" description="This is order page">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Box display="flex" gap={2} my={4}>
        <Typography>{t('order.titleFilter')}</Typography>
        <TextField
          id="time-start"
          variant="outlined"
          type="datetime-local"
          onChange={(e) => setDateFilter(e.target.value)}
          name="dateFilter"
        />

        <TextField
          id="outlined-basic"
          label={t('order.userNameFilter')}
          variant="outlined"
          onChange={(e) => setUserName(e.target.value)}
          name="userName"
        />
      </Box>

      <Stack spacing={1} mt={2}>
        <BlankCard>
          <Box mb={2}>
            <TableToolbar numSelected={selected.length} onSearchChange={handleSearchChange} />
            <TableContainer>
              <Table sx={{ minWidth: '750px' }} aria-labelledby="tableTitle" size={'medium'}>
                <TableHeadCustom
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy as string}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={
                    handleRequestSort as (
                      event: React.MouseEvent<unknown>,
                      property: string | number | symbol,
                    ) => void
                  }
                  rowCount={filteredRows.length}
                  headCells={headCells}
                />
                <TableBody>
                  {filteredRows.map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRowComponent
                        key={row.id}
                        row={row}
                        isSelected={isItemSelected}
                        labelId={labelId}
                        handleClick={handleClick}
                      />
                    );
                  })}
                  {emptyRows > 0 && page === Math.ceil(totalElements / rowsPerPage) - 1 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </BlankCard>
      </Stack>
    </PageContainer>
  );
};

export default OrderView;
