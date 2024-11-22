import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
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
import { getComparator, stableSort } from 'src/utils/table';
import { ProductCategoryDto, SubProductCategoryDto } from 'src/types/apps/productCategory';
import BlankCard from 'src/components/shared/BlankCard';
import TableRowComponent from '../ProductCategoryRow';
import { HeadCell } from 'src/types/layout/table';
import {
  deleteExistingProductCategory,
  fetchProductCategory,
} from 'src/store/apps/productCategory/ProductCategorySlice';
import { useDispatch } from 'src/store/Store';
import { IconEdit, IconLayoutGridAdd, IconPlus, IconTrashX } from '@tabler/icons';
import CustomButton from 'src/components/button/CustomButton';
import { useNavigate } from 'react-router';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import { fetchSubProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { useTranslation } from 'react-i18next';

const ProductCategoryView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { productCategory } = useSelector((state: any) => state.productCategories);
  const { subProductCategory } = useSelector((state: any) => state.subProductCategories);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof SubProductCategoryDto>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategoryDto | null>(null);
  const navigate = useNavigate();

  const headCells: HeadCell[] = [
    { id: 'name', numeric: true, disablePadding: true, label: t('productCategory.subName') },
    { id: 'description', numeric: true, disablePadding: false, label: t('productCategory.description') },
    { id: 'status', numeric: true, disablePadding: false, label: t('productCategory.active') },
    { id: 'action', numeric: false, disablePadding: false, label: '' },
  ];

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(() => {
    const savedCategoryId = localStorage.getItem('activeCategoryId');

    return savedCategoryId ? parseInt(savedCategoryId, 10) : null;
  });

  useEffect(() => {
    dispatch(fetchProductCategory());
  }, [dispatch]);

  useEffect(() => {
    if (productCategory.length > 0) {
      if (activeCategoryId === null) {
        const firstCategoryId = productCategory[0].id;
        setActiveCategoryId(firstCategoryId);
        dispatch(fetchSubProductCategory(firstCategoryId));
      } else {
        dispatch(fetchSubProductCategory(activeCategoryId));
      }
    }
  }, [productCategory, activeCategoryId, dispatch]);

  useEffect(() => {
    if (activeCategoryId !== null) {
      localStorage.setItem('activeCategoryId', activeCategoryId?.toString());
    }
  }, [activeCategoryId]);

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    dispatch(fetchSubProductCategory(categoryId));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = Array.isArray(subProductCategory)
    ? subProductCategory.filter(
        (row: SubProductCategoryDto) =>
          row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof SubProductCategoryDto,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = subProductCategory.map((n: SubProductCategoryDto) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const handleOpenAdd = () => {
    navigate('/product-category/add');
  };

  const handleOpenAddSub = () => {
    navigate(`/sub-product-category/add/${activeCategoryId}`);
  };

  const handleOpenUpdate = () => {
    navigate(`/product-category/update/${activeCategoryId}`);
  };

  const handleOpenDeleteModal = (categoryId: number | null) => {
    if (categoryId !== null) {
      const categoryToDelete = productCategory.find(
        (category: ProductCategoryDto) => category.id === categoryId,
      );
      if (categoryToDelete) {
        setCategoryToDelete(categoryToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteExistingProductCategory(categoryToDelete.id));
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <PageContainer title="Product Category" description="This is product category page">
      <Stack spacing={1} mt={2}>
        <BlankCard>
          <Box p={2}>
            <Typography variant="h5">{t('productCategory.breadcrumbSub')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {productCategory.map((category: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  <CustomButton
                    variant="outlined"
                    onClick={() => handleCategoryClick(category.id)}
                    startIcon={
                      <Avatar
                        src={category.icon}
                        alt={category.name}
                        style={{ width: 24, height: 24 }}
                      />
                    }
                    active={activeCategoryId === category.id}
                  >
                    {category.name}
                  </CustomButton>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="space-between">
              <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
                <Button aria-label="add" color="success" onClick={handleOpenAddSub}>
                  <IconLayoutGridAdd stroke={2} />{t('productCategory.addSub')}
                </Button>
                <Button aria-label="add" color="secondary" onClick={handleOpenAdd}>
                  <IconPlus stroke={2} /> {t('productCategory.add')}
                </Button>
                <Button aria-label="edit" color="primary" onClick={handleOpenUpdate}>
                  <IconEdit stroke={2} /> {t('productCategory.update')}
                </Button>
                <Button
                  aria-label="delete"
                  color="error"
                  onClick={() => handleOpenDeleteModal(activeCategoryId)}
                >
                  <IconTrashX stroke={2} /> {t('productCategory.delete')}
                </Button>
              </Stack>
            </Box>
          </Box>
        </BlankCard>
        <BlankCard>
          <Box mb={2}>
            <TableToolbar numSelected={selected.length} onSearchChange={handleSearchChange} />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
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
                  {stableSort(filteredRows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
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
                  {emptyRows > 0 && (
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
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </BlankCard>
        {categoryToDelete && (
          <ConfirmDeleteModal
            open={isDeleteModalOpen}
            handleClose={handleCloseDeleteModal}
            handleConfirm={handleConfirmDelete}
            name={categoryToDelete.name}
          />
        )}
      </Stack>
    </PageContainer>
  );
};

export default ProductCategoryView;
