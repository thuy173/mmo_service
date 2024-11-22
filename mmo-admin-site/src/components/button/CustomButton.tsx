import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  textTransform: 'none',
  borderColor: active ? '#5d87ff' : '#fff',
  color: active ? '#3559e0' : '#3559e0',
  marginBottom: '8px',
  padding: '15px',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '#e8f7ff',
    borderColor: active ? '#e8f7ff' : '#e8f7ff',
    color: '#3559e0',
  },
}));

export default CustomButton;
