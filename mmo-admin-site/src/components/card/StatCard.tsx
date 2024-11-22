import React from 'react';
import { Card, Typography, Box, IconButton } from '@mui/material';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  isToday: boolean;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, isToday }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        height: '100%',
      }}
    >
      <IconButton
        sx={{
          backgroundColor: color,
          color: 'white',
          width: 56,
          height: 56,
          mr: 2,
        }}
      >
        {icon}
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="textSecondary"
          sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {value}
        </Typography>
        {isToday && (
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Hôm nay
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
