import React, { useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Link,
  Breadcrumbs,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, useDispatch } from 'src/store/Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Spinner from 'src/views/spinner/Spinner';
import { Link as RouterLink } from 'react-router-dom';
import { fetchCoupon, updateExistingCoupon } from 'src/store/apps/coupon/CouponSlice';
import { Add, Remove } from '@mui/icons-material';
import { CouponRequest } from 'src/types/apps/coupon';
import { useTranslation } from 'react-i18next';

const UpdateCoupon: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const couponId = id ? parseInt(id, 10) : 0;

  const coupon = useSelector((state: RootState) =>
    state.coupons.coupons.find((coupon) => coupon.id === couponId),
  );

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/coupon">
      {t('coupon.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('coupon.breadcrumbUpdate')}
    </Typography>,
  ];

  useEffect(() => {
    if (!coupon) {
      dispatch(fetchCoupon());
    }
  }, [dispatch, coupon]);

  const formik = useFormik<CouponRequest>({
    initialValues: {
      id: coupon?.id || 0,
      quantity: coupon?.quantity || 0,
      discount: coupon?.discount || 0,
      minOrderAmount: coupon?.minOrderAmount || 0,
      maxOrderAmount: coupon?.maxOrderAmount || 0,
      applyAll: coupon?.applyAll || false,
    },
    validationSchema: Yup.object({
      quantity: Yup.string().required('Quantity is required'),
      minOrderAmount: Yup.number()
        .min(1, 'Min order amount must be greater than or equal to 1')
        .required('Min order amount is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(updateExistingCoupon(values));
        navigate('/coupon');
      } catch (error) {
        console.error('Error updating coupon:', error);
      }
    },
  });

  return (
    <Box sx={{ padding: 3 }}>
      {formik.isSubmitting ? (
        <Spinner />
      ) : (
        <>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              <TextField
                label={t('coupon.quantity')}
                fullWidth
                {...formik.getFieldProps('quantity')}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() =>
                          formik.setFieldValue(
                            'quantity',
                            Math.max(Number(formik.values.quantity) - 1, 0),
                          )
                        }
                      >
                        <Remove />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          formik.setFieldValue('quantity', Number(formik.values.quantity) + 1)
                        }
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="discount">{t('coupon.inputDiscount')}</InputLabel>
                <OutlinedInput
                  label={t('coupon.inputDiscount')}
                  type="number"
                  id="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                  aria-describedby="discount"
                  inputProps={{
                    'aria-label': 'discount',
                  }}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="min-order-amount">{t('coupon.inputMin')}</InputLabel>
                <OutlinedInput
                  id="min-order-amount"
                  type="number"
                  name="minOrderAmount"
                  value={formik.values.minOrderAmount}
                  endAdornment={
                    <InputAdornment position="end">{t('coupon.currency')}</InputAdornment>
                  }
                  aria-describedby="min-order-amount"
                  inputProps={{
                    'aria-label': 'min-order-amount',
                  }}
                  label={t('coupon.inputMin')}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="max-order-amount">{t('coupon.inputMax')}</InputLabel>
                <OutlinedInput
                  id="max-order-amount"
                  label={t('coupon.inputMax')}
                  type="number"
                  name="maxOrderAmount"
                  value={formik.values.maxOrderAmount}
                  endAdornment={
                    <InputAdornment position="end">{t('coupon.currency')}</InputAdornment>
                  }
                  aria-describedby="max-order-amount"
                  inputProps={{
                    'aria-label': 'max-order-amount',
                  }}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack mt={2}>
              <FormControl fullWidth>
                <InputLabel id="active-label">{t('coupon.apply')}</InputLabel>
                <Select label="ApplyAll" {...formik.getFieldProps('applyAll')} fullWidth>
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {t('btnSave')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/coupon')}>
                {t('btnBack')}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default UpdateCoupon;
