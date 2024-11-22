import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import StatCard from 'src/components/card/StatCard';
import {
  IconBusinessplan,
  IconPresentationAnalytics,
  IconShoppingCart,
  IconUsers,
} from '@tabler/icons';
import { useDispatch, useSelector } from 'src/store/Store';
import { fetchDashboard } from 'src/store/apps/dashboard/DashboardSlice';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVND } from 'src/utils/format/format-currency';
import RevenueProfitChart from './RevenueProfitChart';
import DepositChart from './DepositChart';

const Ecommerce = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboards } = useSelector((state: any) => state.dashboards);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <PageContainer title="eCommerce Dashboard" description="This is the eCommerce Dashboard page">
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<IconUsers stroke={2} />}
              title={t('dashboard.user')}
              value={dashboards?.users || 0}
              color="#7b4ff1"
              isToday={false}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<IconShoppingCart stroke={2} />}
              title={t('dashboard.order')}
              value={dashboards?.orders || 0}
              color="#29b6f6"
              isToday={false}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<IconBusinessplan stroke={2} />}
              title={t('dashboard.orderTotal')}
              value={formatCurrencyVND(dashboards?.ordersTotal) || 0}
              color="#fbc02d"
              isToday={true}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={<IconPresentationAnalytics stroke={2} />}
              title={t('dashboard.revenue')}
              value={formatCurrencyVND(dashboards?.revenue) || 0}
              color="#f44336"
              isToday={true}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <RevenueProfitChart />
        <DepositChart />
      </Box>
    </PageContainer>
  );
};

export default Ecommerce;
