import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { useNavigate } from 'react-router';
import Spinner from 'src/views/spinner/Spinner';
import { IconPlus } from '@tabler/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { addNewCoupon } from 'src/store/apps/coupon/CouponSlice';
import { CouponDto } from 'src/types/apps/coupon';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AddCoupon: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/coupon">
      {t('coupon.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('coupon.breadcrumbAdd')}
    </Typography>,
  ];

  const validationSchema = Yup.object({
    discount: Yup.string().required(t('coupon.reqDiscount') || 'Discount is required'),
    minOrderAmount: Yup.number()
      .required('Min order amount is required')
      .min(0, 'Min order amount must be at least 0'),
  });

  const formik = useFormik({
    initialValues: {
      quantity: 0,
      discount: 0,
      minOrderAmount: 0,
      maxOrderAmount: 0,
      applyAll: 'true',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        ...values,
        applyAll: values.applyAll === 'true',
      };

      try {
        await dispatch(addNewCoupon(payload as CouponDto));
        navigate('/coupon');
      } catch (error) {
        console.error('Error adding coupon:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="discount">{t('coupon.inputDiscount')}</InputLabel>
              <OutlinedInput
                id="discount"
                {...formik.getFieldProps('discount')}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="discount"
                inputProps={{
                  'aria-label': 'discount',
                }}
                label={t('coupon.inputDiscount')}
              />
            </FormControl>
            <TextField
              label={t('coupon.quantity')}
              fullWidth
              {...formik.getFieldProps('quantity')}
              margin="normal"
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
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel htmlFor="min-order-amount">{t('coupon.inputMin')}</InputLabel>
              <OutlinedInput
                id="min-order-amount"
                {...formik.getFieldProps('minOrderAmount')}
                endAdornment={<InputAdornment position="end">{t('coupon.currency')}</InputAdornment>}
                aria-describedby="min-order-amount"
                inputProps={{
                  'aria-label': 'min-order-amount',
                }}
                label={t('coupon.inputMin')}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="max-order-amount">{t('coupon.inputMax')}</InputLabel>
              <OutlinedInput
                id="max-order-amount"
                {...formik.getFieldProps('maxOrderAmount')}
                endAdornment={<InputAdornment position="end">{t('coupon.currency')}</InputAdornment>}
                aria-describedby="max-order-amount"
                inputProps={{
                  'aria-label': 'max-order-amount',
                }}
                label={t('coupon.inputMax')}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Box>
              <FormLabel component="legend">{t('coupon.apply')}</FormLabel>
              <RadioGroup aria-label="applyAll" {...formik.getFieldProps('applyAll')} row>
                <FormControlLabel value="true" control={<Radio />} label="True" />
                <FormControlLabel value="false" control={<Radio />} label="False" />
              </RadioGroup>
            </Box>
          </Stack>

          <Stack justifyContent="center" alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 15, width: '50%' }}
              startIcon={<IconPlus />}
            >
              {t('coupon.btnSubmit')}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default AddCoupon;
