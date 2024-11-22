import { Snackbar, Alert, Slide } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface CustomAlertProps {
  open: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

const SlideTransition = (props: any) => <Slide {...props} direction="left" />;

const CustomAlert = ({
  open,
  severity,
  message,
  onClose,
  autoHideDuration = 2000,
}: CustomAlertProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
        icon={<CheckIcon fontSize="inherit" />}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
