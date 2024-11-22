import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
} from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import { IconBrandUnsplash, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import { ProductDto } from 'src/types/apps/product';
import { deleteExistingProduct } from 'src/store/apps/product/ProductSlice';
import EnumChip from 'src/components/chip/EnumChip';
import { formatDateTimeLocal } from 'src/utils/format/format-time';
import StatusChip from 'src/components/chip/StatusChip';
import { useTranslation } from 'react-i18next';

interface TableRowComponentProps {
  row: ProductDto;
  isSelected: boolean;
  labelId: string;
  handleClick: (event: React.MouseEvent<unknown>, name: string) => void;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({
  row,
  isSelected,
  labelId,
  handleClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);

  const { products } = useSelector((state: any) => state.products);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: number) => {
    navigate(`/product/update/${id}`);
    setAnchorEl(null);
  };
  const handleOpenStock = (id: number) => {
    navigate(`/account-in-stock/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (productId: number | null) => {
    if (productId !== null) {
      const productToDelete = products.find((product: ProductDto) => product.id === productId);
      if (productToDelete) {
        setProductToDelete(productToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteExistingProduct(productToDelete.id));
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={row.id}
        selected={isSelected}
      >
        <TableCell padding="checkbox">
          <CustomCheckbox checked={isSelected} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="left">
          <Box display="flex" alignItems="center" justifyContent="start">
            <img src={row.image} alt={row.name} style={{ width: 24, height: 24, marginRight: 8 }} />
            <Typography variant="subtitle2">{row.name}</Typography>
          </Box>
        </TableCell>
        <TableCell align="left">
          <Box justifyContent="space-between">
            <Typography variant="body2">
              {t('product.sellPrice')}:
              <span style={{ color: ' red', fontWeight: 'bold' }}>{row.sellPrice}đ</span>
            </Typography>
            <Typography variant="body2">
              {t('product.capitalPrice')}:
              <span style={{ color: ' blue', fontWeight: 'bold' }}> {row.capitalPrice}đ</span>
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="left">
          <Box justifyContent="space-between">
            <Typography variant="body2">
              {t('product.accountInStock')}:
              <span style={{ color: ' green', fontWeight: 'bold' }}>{row.availableAccountQty}</span>
            </Typography>
            <Typography variant="body2">
              {t('product.accountSold')}:
              <span style={{ color: ' red', fontWeight: 'bold' }}> {row.soldAccountQty}</span>
            </Typography>
          </Box>
        </TableCell>

        <TableCell align="center">{row.productSubCategory?.name}</TableCell>
        <TableCell align="center">{row.shortDescription}</TableCell>

        <TableCell align="center">
          <EnumChip status={row.checkLiveAccountStatus} />
        </TableCell>

        <TableCell align="center">
          <StatusChip status={row.active} />
        </TableCell>
        <TableCell align="center">{formatDateTimeLocal(row.createdAt)}</TableCell>

        <TableCell
          align="right"
          sx={{ position: 'sticky', right: 0, background: '#fff', zIndex: 1 }}
        >
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(event) => {
              event.stopPropagation();
              handleMenuClick(event);
            }}
          >
            <IconDotsVertical width={18} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={(event) => {
                handleOpenStock(row.id);
                handleMenuClose(event);
              }}
            >
              <ListItemIcon>
                <IconBrandUnsplash width={18} />
              </ListItemIcon>
              {t('btnStock')}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handleOpenUpdateSub(row.id);
                handleMenuClose(event);
              }}
            >
              <ListItemIcon>
                <IconEdit width={18} />
              </ListItemIcon>
              {t('btnUpdate')}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                handleOpenDeleteModal(row.id);
                handleMenuClose(event);
              }}
            >
              <ListItemIcon>
                <IconTrash width={18} />
              </ListItemIcon>
              {t('btnDelete')}
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      {productToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={productToDelete.name}
        />
      )}
    </>
  );
};

export default TableRowComponent;
