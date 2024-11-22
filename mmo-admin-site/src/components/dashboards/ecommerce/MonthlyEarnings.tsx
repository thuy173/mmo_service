import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';
import icon1Img from 'src/assets/images/svgs/icon-master-card-2.svg';

const MonthlyEarnings = () => {
  // chart color
  const theme = useTheme();
  const successlight = theme.palette.success.light;

  return (
    <DashboardCard
      title="Monthly Earnings"
      action={
        <Avatar
          variant="rounded"
          sx={{ bgcolor: (theme) => theme.palette.primary.light, width: 40, height: 40 }}
        >
          <Avatar src={icon1Img} alt={icon1Img} sx={{ width: 24, height: 24 }} />
        </Avatar>
      }
    >
      <>
        <Stack direction="row" spacing={1} alignItems="center" mb={5}>
          <Typography variant="h3" fontWeight="700">
            $6,820
          </Typography>
          <Stack direction="row" spacing={1} mt={1} mb={2} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 20, height: 20 }}>
              <IconArrowUpLeft width={18} color="#13DEB9" />
            </Avatar>
            <Typography variant="subtitle2" color="textSecondary">
              +9%
            </Typography>
          </Stack>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
