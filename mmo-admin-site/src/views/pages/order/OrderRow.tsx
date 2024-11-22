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
import { IconDetails, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import { deleteExistingCoupon } from 'src/store/apps/coupon/CouponSlice';
import { formatDateTimeLocal } from 'src/utils/format/format-time';
import { OrderDto } from 'src/types/apps/order';
import DetailDialog from './view/DetailDialog';
import { fetchAccountByOrderId } from 'src/store/apps/order/OrderSlice';
import { useTranslation } from 'react-i18next';

interface TableRowComponentProps {
  row: OrderDto;
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
  const [couponToDelete, setCouponToDelete] = useState<OrderDto | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { orders } = useSelector((state: any) => state.orders);
  const account = useSelector((state: any) => state.orders.account);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: string) => {
    navigate(`/coupon/update/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (couponId: string | null) => {
    if (couponId !== null) {
      const couponToDelete = orders.find((coupon: OrderDto) => coupon.id === couponId);
      if (couponToDelete) {
        setCouponToDelete(couponToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      dispatch(deleteExistingCoupon(100));
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleOpenDetailModal = (orderId: string | null) => {
    if (orderId !== null) {
      dispatch(fetchAccountByOrderId(orderId)).then(() => {
        setIsDetailModalOpen(true);
      });
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.orderCode)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={row.id}
        selected={isSelected}
      >
        <TableCell padding="checkbox">
          <CustomCheckbox checked={isSelected} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        {/* <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.userId}</Typography>
        </TableCell> */}

        <TableCell align="left">
          <Box justifyContent="space-between">
            <Typography variant="body2">
              {t('order.orderCode')}:
              <span style={{ color: ' red', fontWeight: 'bold' }}>{row.orderCode}</span>
            </Typography>
            <Typography variant="body2">
              Server API:#
              <span style={{ color: ' blue', fontWeight: 'bold' }}> {row.id}</span>
            </Typography>
          </Box>
        </TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.product?.name}</Typography>
        </TableCell>

        <TableCell align="left">
          <Box justifyContent="space-between">
            <Typography variant="body2">
              {t('order.quantity')}:
              <span style={{ color: ' red', fontWeight: 'bold' }}>{row.quantity}</span>
            </Typography>
            <Typography variant="body2">
              {t('order.amount')}:
              <span style={{ color: ' blue', fontWeight: 'bold' }}> {row.amount}</span>
            </Typography>
          </Box>
        </TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{formatDateTimeLocal(row.createdAt)}</Typography>
        </TableCell>

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
                handleOpenDetailModal(row.id);
                handleMenuClose(event);
              }}
            >
              <ListItemIcon>
                <IconDetails width={18} />
              </ListItemIcon>
              {t('btnDetail')}
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
              Refund
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
          </Menu>{' '}
        </TableCell>
      </TableRow>
      {couponToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={couponToDelete.orderCode}
        />
      )}
      <DetailDialog
        open={isDetailModalOpen}
        handleClose={handleCloseDetailModal}
        account={account}
      />
    </>
  );
};

export default TableRowComponent;
