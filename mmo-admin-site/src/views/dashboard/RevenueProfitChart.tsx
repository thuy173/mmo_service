import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'src/store/Store';
import { fetchProfit, fetchRevenue } from 'src/store/apps/dashboard/DashboardSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 120,
    },
  },
};

const RevenueProfitChart: React.FC = () => {
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [labels, setLabels] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { revenueData, profitData } = useSelector((state: any) => state.dashboards);

  useEffect(() => {
    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const newLabels = Array.from({ length: daysInMonth }, (_, i) =>
      dayjs(new Date(year, month - 1, i + 1)).format('DD'),
    );
    setLabels(newLabels);

    dispatch(fetchRevenue(month, year));
    dispatch(fetchProfit(month, year));
  }, [dispatch, month, year]);

  const revenueDataset = labels.map((label) => {
    const fullDate = dayjs(`${year}-${month}-${label}`).format('YYYY-MM-DD');

    return revenueData[fullDate] || 0;
  });

  const profitDataset = labels.map((label) => {
    const fullDate = dayjs(`${year}-${month}-${label}`).format('YYYY-MM-DD');

    return profitData[fullDate] || 0;
  });

  const orderData = {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueDataset,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Lợi nhuận',
        data: profitDataset,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tổng tiền (VND)',
        },
      },
    },
  };

  return (
    <div>
      <h2>
        Thống kê đơn hàng tháng {month}/{year}
      </h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Chọn tháng</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            label="Chọn tháng"
            MenuProps={MenuProps}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Chọn năm</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            label="Chọn năm"
            MenuProps={MenuProps}
          >
            {Array.from({ length: 5 }, (_, i) => dayjs().year() - i).map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Bar data={orderData} options={options} />
    </div>
  );
};

export default RevenueProfitChart;
