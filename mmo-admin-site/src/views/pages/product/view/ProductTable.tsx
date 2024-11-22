import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import TableRowComponent from '../ProductRow';
import { HeadCell } from 'src/types/layout/table';
import { useDispatch } from 'src/store/Store';
import { useNavigate } from 'react-router';
import { IconPlus } from '@tabler/icons';
import { fetchProduct } from 'src/store/apps/product/ProductSlice';
import { ProductDto } from 'src/types/apps/product';
import { fetchFullProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, totalElements } = useSelector((state: any) => state.products);
  const { fullProductCategory } = useSelector((state: any) => state.subProductCategories);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof ProductDto>('id');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [subProductCategoryId, setSubProductCategoryId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const headCells: HeadCell[] = [
    { id: 'name', numeric: true, disablePadding: true, label: t('product.name') },
    { id: 'price', numeric: true, disablePadding: false, label: t('product.price') },
    { id: 'account', numeric: true, disablePadding: false, label: t('product.account') },
    { id: 'category', numeric: true, disablePadding: false, label: t('product.category') },
    {
      id: 'shortDescription',
      numeric: true,
      disablePadding: false,
      label: t('product.shortDescription'),
    },
    {
      id: 'checkLiveAccountStatus',
      numeric: true,
      disablePadding: false,
      label: t('product.checkLive'),
    },
    { id: 'active', numeric: true, disablePadding: false, label: t('product.active') },
    { id: 'create', numeric: true, disablePadding: false, label: t('product.createAt') },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/">
      {t('breadcrumbHome')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('product.breadcrumbSub')}
    </Typography>,
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setSubProductCategoryId(Number(event.target.value));
    setPage(0);
  };

  const filteredRows = Array.isArray(products) ? products : [];

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ProductDto) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n: ProductDto) => n.name);
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

  const handleOpenAdd = () => {
    navigate('/product/add');
  };

  useEffect(() => {
    dispatch(
      fetchProduct(
        searchTerm,
        subProductCategoryId,
        page,
        rowsPerPage,
        orderBy,
        order.toUpperCase(),
      ),
    );
  }, [dispatch, searchTerm, subProductCategoryId, page, rowsPerPage, orderBy, order]);

  useEffect(() => {
    dispatch(fetchFullProductCategory());
  }, [dispatch]);

  return (
    <PageContainer title="Product" description="This is product page">
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <Button aria-label="add" color="secondary" onClick={handleOpenAdd}>
          <IconPlus stroke={2} /> {t('product.breadcrumbAdd')}
        </Button>
      </Stack>
      <FormControl fullWidth variant="outlined" sx={{ my: 2, width: '30%' }}>
        <InputLabel id="category-label">{t('product.category')}</InputLabel>
        <Select
          labelId="category-label"
          value={subProductCategoryId ?? ''}
          onChange={handleCategoryChange}
          label={t('product.category')}
        >
          {fullProductCategory.flatMap((category: any) => [
            <MenuItem key={`category-${category.id}`} disabled>
              {category.name}
            </MenuItem>,
            ...category.subProductCategories.map((subCategory: any) => (
              <MenuItem key={`subcategory-${subCategory.id}`} value={subCategory.id}>
                <img
                  src={subCategory.icon}
                  alt={subCategory.name}
                  style={{ width: '20px', marginRight: '8px' }}
                />
                {`${subCategory.name}`}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
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
              <Table sx={{ minWidth: '1600px' }} aria-labelledby="tableTitle" size={'medium'}>
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

export default ProductView;
