import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import StatusChip from 'src/components/chip/StatusChip';
import { CouponDto } from 'src/types/apps/coupon';
import { deleteExistingCoupon } from 'src/store/apps/coupon/CouponSlice';
import { formatDateTimeLocal } from 'src/utils/format/format-time';

interface TableRowComponentProps {
  row: CouponDto;
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CouponDto | null>(null);

  const { coupons } = useSelector((state: any) => state.coupons);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: number) => {
    navigate(`/coupon/update/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (couponId: number | null) => {
    if (couponId !== null) {
      const couponToDelete = coupons.find(
        (coupon: CouponDto) => coupon.id === couponId,
      );
      if (couponToDelete) {
        setCouponToDelete(couponToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      dispatch(deleteExistingCoupon(couponToDelete.id));
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
        onClick={(event) => handleClick(event, row.couponCode)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={row.id}
        selected={isSelected}
      >
        <TableCell padding="checkbox">
          <CustomCheckbox checked={isSelected} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.couponCode}</Typography>
        </TableCell>
        
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.quantity}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.discount}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.minOrderAmount}  &rarr; {row.maxOrderAmount}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{formatDateTimeLocal(row.createdAt)}</Typography>
        </TableCell>
        <TableCell align="center">
          <StatusChip status={row.applyAll} />
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
                handleOpenUpdateSub(row.id);
                handleMenuClose(event);
              }}
            >
              <ListItemIcon>
                <IconEdit width={18} />
              </ListItemIcon>
              Edit
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
              Delete
            </MenuItem>
          </Menu>{' '}
        </TableCell>
      </TableRow>
      {couponToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={couponToDelete.couponCode}
        />
      )}
    </>
  );
};

export default TableRowComponent;
