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
  Typography,
} from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import { HeadCell } from 'src/types/layout/table';
import { useDispatch } from 'src/store/Store';
import { Link as RouterLink } from 'react-router-dom';
import { TransactionDto } from 'src/types/apps/transaction';
import { fetchTransaction } from 'src/store/apps/transaction/TransactionSlice';
import TableHeadBase from 'src/components/tables/TableHeadBase';
import TableRowComponent from '../TransactionRow';
import { useTranslation } from 'react-i18next';

const TransactionView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { transactions, totalElements } = useSelector((state: any) => state.transactions);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof TransactionDto>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm] = useState<string>('');

  const headCells: HeadCell[] = [
    { id: 'userName', numeric: true, disablePadding: false, label: t('transaction.userName') },
    {
      id: 'balanceBefore',
      numeric: true,
      disablePadding: false,
      label: t('transaction.balanceBefore'),
    },
    { id: 'amount', numeric: true, disablePadding: false, label: t('transaction.amount') },
    {
      id: 'balanceAfter',
      numeric: true,
      disablePadding: false,
      label: t('transaction.balanceAfter'),
    },
    { id: 'reason', numeric: true, disablePadding: false, label: t('transaction.reason') },
    { id: 'createAt', numeric: true, disablePadding: false, label: t('transaction.createAt') },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/">
      {t('breadcrumbHome')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('transaction.breadcrumbSub')}
    </Typography>,
  ];

  const filteredRows = Array.isArray(transactions)
    ? transactions.filter(
        (row: TransactionDto) =>
          row.transactionType.toLowerCase().includes(searchTerm) ||
          row.reason.toLowerCase().includes(searchTerm),
      )
    : [];

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TransactionDto) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, rowsPerPage - filteredRows.length);

  useEffect(() => {
    dispatch(fetchTransaction(page, rowsPerPage, orderBy, order.toUpperCase()));
  }, [dispatch, page, rowsPerPage, orderBy, order]);

  return (
    <PageContainer title="Transaction" description="This is transaction page">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Stack spacing={1} mt={2}>
        <BlankCard>
          <Box mb={2}>
            <TableContainer
              sx={{
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              <Table sx={{ minWidth: '1000px' }} aria-labelledby="tableTitle" size={'medium'}>
                <TableHeadBase
                  order={order}
                  orderBy={orderBy as string}
                  onRequestSort={
                    handleRequestSort as (
                      event: React.MouseEvent<unknown>,
                      property: string | number | symbol,
                    ) => void
                  }
                  headCells={headCells}
                />
                <TableBody>
                  {filteredRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return <TableRowComponent key={row.id} row={row} labelId={labelId} />;
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

export default TransactionView;
