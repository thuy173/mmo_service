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
import { PostDto } from 'src/types/apps/post';
import { deleteExistingPost } from 'src/store/apps/post/PostSlice';

interface TableRowComponentProps {
  row: PostDto;
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
  const [postToDelete, setPostToDelete] = useState<PostDto | null>(null);

  const { posts } = useSelector((state: any) => state.posts);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenUpdateSub = (id: number) => {
    navigate(`/post/update/${id}`);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = (postId: number | null) => {
    if (postId !== null) {
      const postToDelete = posts.find(
        (post: PostDto) => post.id === postId,
      );
      if (postToDelete) {
        setPostToDelete(postToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      dispatch(deleteExistingPost(postToDelete.id));
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
        onClick={(event) => handleClick(event, row.title)}
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
          <Typography variant="subtitle2">{row.title}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <img src={row.thumbnail} alt={row.title} style={{ width: 48, objectFit:'cover' }} />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.postCategory?.name}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
          <Typography variant="subtitle2">{row.author?.fullName}</Typography>
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
      {postToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={postToDelete.title}
        />
      )}
    </>
  );
};

export default TableRowComponent;
