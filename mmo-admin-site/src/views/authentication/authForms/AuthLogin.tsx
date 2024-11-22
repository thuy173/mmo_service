import { Box, Typography, Button, Stack } from '@mui/material';
import { loginType } from 'src/types/auth/auth';
import { AppDispatch } from 'src/store/Store';
import { useDispatch } from 'react-redux';
import { loginUser } from 'src/store/apps/auth/LoginSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from 'src/components/alert/CustomAlert';
import { useTranslation } from 'react-i18next';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtext }: loginType) => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(loginUser(credentials))
      .then(() => {
        setAlert({ open: true, severity: 'success', message: t('login.successMessage') });
        navigate('/');
      })
      .catch(() => {
        setAlert({ open: true, severity: 'error', message: t('login.errorMessage') });
      });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {t('login.title')}
        </Typography>
      ) : null}

      {subtext}

      {/* Alert Snackbar */}
      <CustomAlert
        open={alert.open}
        severity={alert.severity as 'error' | 'success'}
        message={alert.message}
        onClose={handleClose}
      />

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">{t('login.username')}</CustomFormLabel>
          <CustomTextField
            id="username"
            variant="outlined"
            fullWidth
            value={credentials.username}
            onChange={(e: any) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">{t('login.password')}</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={credentials.password}
            onChange={(e: any) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </Box>
      </Stack>
      <Box mt={7}>
        <Button
          type="button"
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
        >
          {t('login.button')}
        </Button>
      </Box>
    </>
  );
};

export default AuthLogin;
