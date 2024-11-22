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
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { fetchDeposit } from 'src/store/apps/dashboard/DashboardSlice';
import { useDispatch, useSelector } from 'src/store/Store';
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

const DepositChart: React.FC = () => {
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [labels, setLabels] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { depositData } = useSelector((state: any) => state.dashboards);

  useEffect(() => {
    const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
    const newLabels = Array.from({ length: daysInMonth }, (_, i) =>
      dayjs(new Date(year, month - 1, i + 1)).format('DD'),
    );
    setLabels(newLabels);

    dispatch(fetchDeposit(month, year));
  }, [dispatch, month, year]);

  const depositDataChart = {
    labels,
    datasets: [
      {
        label: 'Tổng tiền nạp',
        data: labels.map((label) => {
          const formattedLabel = `${year}-${String(month).padStart(2, '0')}-${label.padStart(
            2,
            '0',
          )}`;

          return depositData ? depositData[formattedLabel] || 0 : 0;
        }),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
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
          text: 'Tổng tiền nạp (VND)',
        },
      },
    },
  };

  return (
    <div>
      <h2>
        Thống kê nạp tiền tháng {month}/{year}
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
      <Line data={depositDataChart} options={options} />
    </div>
  );
};

export default DepositChart;
