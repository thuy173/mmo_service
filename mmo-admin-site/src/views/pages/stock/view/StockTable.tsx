import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Breadcrumbs,
  Button,
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
import TableToolbar from 'src/components/tables/TableToolbar';
import TableHeadCustom from 'src/components/tables/TableHead';
import BlankCard from 'src/components/shared/BlankCard';
import { HeadCell } from 'src/types/layout/table';
import { useDispatch } from 'src/store/Store';
import TableRowComponent from '../StockRow';
import { AccountResponseDto } from 'src/types/apps/account';
import { deleteAccountByProductId, fetchAccountInStock } from 'src/store/apps/stock/StockSlice';
import { useParams } from 'react-router';
import { IconPlus } from '@tabler/icons';
import AddAccountDialog from './AddAccountProduct';
import AddAccountFile from './AddAccountFileProduct';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AccountInStock: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { stocks, totalElements } = useSelector((state: any) => state.stocks);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof AccountResponseDto>('id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const productId = id ? parseInt(id, 10) : 0;
  const [openAddAccountDialog, setOpenAddAccountDialog] = useState(false);
  const [openAddAccountFileDialog, setOpenAddAccountFileDialog] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const headCells: HeadCell[] = [
    { id: 'account', numeric: true, disablePadding: true, label: t('stock.account') },
    { id: 'productCode', numeric: true, disablePadding: false, label: t('stock.productCode') },
    { id: 'create', numeric: true, disablePadding: false, label: t('stock.createAt') },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/">
      {t('breadcrumbHome')}
    </Link>,
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/product">
      {t('product.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('stock.breadcrumbSub')}
    </Typography>,
  ];

  const handleOpenAddAccountDialog = () => {
    setOpenAddAccountDialog(true);
  };

  const handleCloseAddAccountDialog = () => {
    setOpenAddAccountDialog(false);
  };

  const handleOpenAddAccountFileDialog = () => {
    setOpenAddAccountFileDialog(true);
  };

  const handleCloseAddAccountFileDialog = () => {
    setOpenAddAccountFileDialog(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = Array.isArray(stocks) ? stocks : [];

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AccountResponseDto,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n: AccountResponseDto) => n.account);
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

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productId) {
      dispatch(deleteAccountByProductId(productId));
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    dispatch(
      fetchAccountInStock(productId, searchTerm, page, rowsPerPage, orderBy, order.toUpperCase()),
    );
  }, [dispatch, productId, searchTerm, page, rowsPerPage, orderBy, order]);

  return (
    <PageContainer title="Account" description="This is account page">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      <Stack direction="row" justifyContent="start" alignItems="center" spacing={2} mt={2}>
        <Button aria-label="add" color="secondary" onClick={handleOpenAddAccountDialog}>
          <IconPlus stroke={2} /> {t('stock.addAccountText')}
        </Button>
        <Button aria-label="add" color="success" onClick={handleOpenAddAccountFileDialog}>
          <IconPlus stroke={2} /> {t('stock.addAccountFile')}
        </Button>
        <Button aria-label="add" color="error" onClick={handleOpenDeleteModal}>
          <Delete /> {t('stock.deleteAll')}
        </Button>
      </Stack>
      <AddAccountDialog
        open={openAddAccountDialog}
        handleClose={handleCloseAddAccountDialog}
        productId={productId}
      />
      <AddAccountFile
        open={openAddAccountFileDialog}
        handleClose={handleCloseAddAccountFileDialog}
        productId={productId}
      />
      <Stack spacing={1} mt={2}>
        <BlankCard>
          <Box mb={2}>
            <TableToolbar numSelected={selected.length} onSearchChange={handleSearchChange} />
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
                    const isItemSelected = isSelected(row.account);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRowComponent
                        key={`${row.id}-${page}`}
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
      {isDeleteModalOpen ? (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={productId.toString()}
        />
      ) : (
        (null as unknown as JSX.Element)
      )}
    </PageContainer>
  );
};

export default AccountInStock;
