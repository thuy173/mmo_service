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
import { useNavigate } from 'react-router';
import { IconPlus } from '@tabler/icons';
import TableRowComponent from '../CouponRow';
import { CouponDto } from 'src/types/apps/coupon';
import { fetchCoupon } from 'src/store/apps/coupon/CouponSlice';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CouponView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { coupons, totalElements } = useSelector((state: any) => state.coupons);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof CouponDto>('id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const headCells: HeadCell[] = [
    { id: 'couponCode', numeric: true, disablePadding: true, label: t('coupon.couponCode') },
    { id: 'quantity', numeric: true, disablePadding: false, label: t('coupon.quantity') },
    { id: 'discount', numeric: true, disablePadding: false, label: t('coupon.discount') },
    { id: 'limit', numeric: true, disablePadding: false, label: t('coupon.limit') },
    { id: 'createAt', numeric: true, disablePadding: false, label: t('coupon.create') },
    { id: 'applyAll', numeric: true, disablePadding: false, label: t('coupon.apply') },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/">
      {t('breadcrumbHome')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('coupon.breadcrumbSub')}
    </Typography>,
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRows = Array.isArray(coupons)
    ? coupons.filter((row: CouponDto) => row?.couponCode?.toLowerCase().includes(searchTerm))
    : [];

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof CouponDto) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n: CouponDto) => n.couponCode);
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
    dispatch(fetchCoupon(page, rowsPerPage, orderBy, order.toUpperCase()));
  }, [dispatch, page, rowsPerPage, orderBy, order]);

  const handleOpenAdd = () => {
    navigate('/coupon/add');
  };

  return (
    <PageContainer title="Coupon" description="This is coupon page">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <Button aria-label="add" color="secondary" onClick={handleOpenAdd}>
          <IconPlus stroke={2} /> {t('coupon.btnAdd')}
        </Button>
      </Stack>
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

export default CouponView;