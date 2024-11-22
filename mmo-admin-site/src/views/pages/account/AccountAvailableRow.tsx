import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, ListItemIcon, Typography } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import ConfirmDeleteModal from 'src/components/dialog/ConfirmDeleteModal';
import { formatDateTimeLocal } from 'src/utils/format/format-time';
import { AccountResponseDto } from 'src/types/apps/account';
import { deleteExistingAccount } from 'src/store/apps/account/AccountSlice';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';

interface TableRowComponentProps {
  row: AccountResponseDto;
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
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AccountResponseDto | null>(null);

  const { accounts } = useSelector((state: any) => state.accounts);

  const handleOpenDeleteModal = (accountId: string | null) => {
    if (accountId !== null) {
      const accountToDelete = accounts.find(
        (account: AccountResponseDto) => account.id === accountId,
      );
      if (accountToDelete) {
        setAccountToDelete(accountToDelete);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      dispatch(deleteExistingAccount(accountToDelete.id));
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
        onClick={(event) => handleClick(event, row.account)}
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
          <Typography variant="subtitle2">{row.account}</Typography>
        </TableCell>

        <TableCell align="center">{row.productCode}</TableCell>
        <TableCell align="center">{formatDateTimeLocal(row.createdAt)}</TableCell>

        <TableCell
          align="right"
          sx={{ position: 'sticky', right: 0, background: '#fff', zIndex: 1 }}
        >
          <IconButton
            onClick={() => {
              handleOpenDeleteModal(row.id);
            }}
          >
            <ListItemIcon sx={{ color: 'red' }}>
              <IconTrash width={18} />
            </ListItemIcon>
          </IconButton>
        </TableCell>
      </TableRow>
      {accountToDelete && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          name={accountToDelete.account}
        />
      )}
    </>
  );
};

export default TableRowComponent;
