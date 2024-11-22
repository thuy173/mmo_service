import { Box, Container, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/errorimg.svg';

const Error = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <img src={ErrorImg} alt="404" />
        <Typography align="center" variant="h1" mb={4}>
          {t('error.title')}
        </Typography>
        <Typography align="center" variant="h4" mb={4}>
          {t('error.content')}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/dashboards"
          disableElevation
        >
          {t('error.button')}
        </Button>
      </Container>
    </Box>
  );
};

export default Error;
