import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatusChipProps {
  status: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const theme = useTheme();

  const getChipStyles = (status: boolean) => {
    switch (status) {
      case true:
        return {
          bgcolor: theme.palette.success.light,
          color: theme.palette.success.main,
        };
      case false:
        return {
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.main,
        };
      default:
        return {
          bgcolor: theme.palette.secondary.light,
          color: theme.palette.secondary.main,
        };
    }
  };

  return (
    <Chip
      sx={{
        borderRadius: '8px',
        ...getChipStyles(status),
      }}
      size="small"
      label={status ? 'Active' : 'Hidden'}
    />
  );
};

export default StatusChip;
