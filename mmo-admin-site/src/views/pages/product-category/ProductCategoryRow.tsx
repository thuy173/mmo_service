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
import StatusChip from 'src/components/chip/StatusChip';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons';
import { SubProductCategoryDto } from 'src/types/apps/productCategory';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { deleteSubProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { useDispatch } from 'src/store/Store';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';

interface TableRowComponentProps {
  row: SubProductCategoryDto;
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
  const [categoryToDelete, setCategoryToDelete] = useState<SubProductCategoryDto | null>(null);

  const { subProductCategory } = useSelector((state: any) => state.subProductCategories);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: number) => {
    navigate(`/sub-product-category/update/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (categoryId: number | null) => {
    if (categoryId !== null) {
      const categoryToDelete = subProductCategory.find(
        (category: SubProductCategoryDto) => category.id === categoryId,
      );
      if (categoryToDelete) {
        setCategoryToDelete(categoryToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteSubProductCategory(categoryToDelete.id));
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
            <img src={row.icon} alt={row.name} style={{ width: 24, height: 24, marginRight: 8, marginLeft: 30 }} />
            <Typography variant="subtitle2">{row.name}</Typography>
          </Box>
        </TableCell>
        <TableCell align="center">{row.description}</TableCell>

        <TableCell align="center">
          <StatusChip status={row.active} />
        </TableCell>
        <TableCell align="right">
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
      {categoryToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={categoryToDelete.name}
        />
      )}
    </>
  );
};

export default TableRowComponent;
