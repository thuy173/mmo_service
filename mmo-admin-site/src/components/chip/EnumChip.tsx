import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AccountStatusChipProps {
  status: string;
}

const EnumChip: React.FC<AccountStatusChipProps> = ({ status }) => {
  const theme = useTheme();

  const getChipStyles = (status: string) => {
    switch (status) {
      case 'HOTMAIL':
        return {
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        };
      case 'GMAIL':
        return {
          bgcolor: theme.palette.info.light,
          color: theme.palette.info.main,
        };
      case 'FACEBOOK':
        return {
          bgcolor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        };
      case 'NONE':
      default:
        return {
          bgcolor: theme.palette.grey[300],
          color: theme.palette.text.primary,
        };
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'HOTMAIL':
        return 'Hotmail';
      case 'GMAIL':
        return 'Gmail';
      case 'FACEBOOK':
        return 'Facebook';
      case 'NONE':
      default:
        return 'None';
    }
  };

  return (
    <Chip
      sx={{
        borderRadius: '8px',
        ...getChipStyles(status),
      }}
      size="small"
      label={getLabel(status)}
    />
  );
};

export default EnumChip;
