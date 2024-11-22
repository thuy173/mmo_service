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
import { PostCategoryDto } from 'src/types/apps/postCategory';
import { deleteExistingPostCategory } from 'src/store/apps/postCategory/PostCategorySlice';
import StatusChip from 'src/components/chip/StatusChip';

interface TableRowComponentProps {
  row: PostCategoryDto;
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
  const [categoryToDelete, setCategoryToDelete] = useState<PostCategoryDto | null>(null);

  const { postCategory } = useSelector((state: any) => state.postCategories);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: number) => {
    navigate(`/post-category/update/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (categoryId: number | null) => {
    if (categoryId !== null) {
      const categoryToDelete = postCategory.find(
        (category: PostCategoryDto) => category.id === categoryId,
      );
      if (categoryToDelete) {
        setCategoryToDelete(categoryToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteExistingPostCategory(categoryToDelete.id));
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
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.name}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <img src={row.image} alt={row.name} style={{ width: 48, marginRight: 8, objectFit:'cover' }} />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.description}</Typography>
        </TableCell>
        <TableCell align="center">
          <StatusChip status={row.active} />
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
