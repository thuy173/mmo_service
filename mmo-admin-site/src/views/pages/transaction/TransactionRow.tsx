import React from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';
import { formatDateTimeLocal } from 'src/utils/format/format-time';
import { TransactionDto } from 'src/types/apps/transaction';

interface TableRowComponentProps {
  row: TransactionDto;
  labelId: string;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({ row, labelId }) => {
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="body1">{row.user?.username}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="subtitle2">{row.balanceBefore}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="subtitle2">{row.amount}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="subtitle2">{row.balanceAfter}</Typography>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="subtitle2">{row.reason}</Typography>
        </TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="normal" align="center">
          <Typography variant="subtitle2">{formatDateTimeLocal(row.createdAt)}</Typography>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableRowComponent;
