import React, { useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
  Link,
  Breadcrumbs,
  InputAdornment,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, useDispatch } from 'src/store/Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
  fetchProductCategory,
  updateExistingProductCategory,
} from 'src/store/apps/productCategory/ProductCategorySlice';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto } from '@tabler/icons';
import { Link as RouterLink } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const UpdateProductCategory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const categoryId = id ? parseInt(id, 10) : 0;

  const category = useSelector((state: RootState) =>
    state.productCategories.productCategory.find((category) => category.id === categoryId),
  );

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/product-category">
      {t('productCategory.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('productCategory.update')}
    </Typography>,
  ];

  useEffect(() => {
    if (!category) {
      dispatch(fetchProductCategory());
    }
  }, [dispatch, category]);

  const formik = useFormik({
    initialValues: {
      id: category?.id || 0,
      name: category?.name || '',
      orderNum: category?.orderNum || 0,
      iconUrl: category?.icon as File | string | undefined,
      description: category?.description || '',
      active: category?.active || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
    }),
    onSubmit: async (values) => {
      const updatedFormData = new FormData();
      updatedFormData.append('id', values.id.toString());
      updatedFormData.append('name', values.name);
      updatedFormData.append('orderNum', values.orderNum.toString());
      updatedFormData.append('description', values.description);
      updatedFormData.append('isActive', values.active.toString());

      if (values.iconUrl instanceof File) {
        updatedFormData.append('icon', values.iconUrl);
      }

      try {
        await dispatch(updateExistingProductCategory(updatedFormData));
        navigate('/product-category');
      } catch (error) {
        console.error('Error updating product category:', error);
      }
    },
  });

  return (
    <Box sx={{ padding: 1 }}>
      {formik.isSubmitting ? (
        <Spinner />
      ) : (
        <>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              sx={{ mt: 3 }}
              label={t('productCategory.orderNum')}
              {...formik.getFieldProps('orderNum')}
              margin="normal"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() =>
                        formik.setFieldValue(
                          'orderNum',
                          Math.max(Number(formik.values.orderNum) - 1, 0),
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
                        formik.setFieldValue('orderNum', Number(formik.values.orderNum) + 1)
                      }
                    >
                      <Add />
                    </IconButton>
                  </InputAdornment>
                ),
                inputProps: {
                  style: { textAlign: 'center', maxWidth: '100px' },
                },
              }}
            />
            <TextField
              label={t('productCategory.name')}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <IconButton color="primary" component="label">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      formik.setFieldValue('iconUrl', file);
                    }
                  }}
                />
                <IconPhoto />
              </IconButton>
              {formik.values.iconUrl && (
                <img
                  src={
                    typeof formik.values.iconUrl === 'string'
                      ? formik.values.iconUrl
                      : URL.createObjectURL(formik.values.iconUrl)
                  }
                  alt="Icon"
                  width={40}
                  height={40}
                />
              )}
            </Box>
            <TextField
              label={t('productCategory.description')}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.active}
                  onChange={(e) => formik.setFieldValue('active', e.target.checked)}
                  name="active"
                />
              }
              label={t('productCategory.active')}
            />
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {t('btnSave')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/product-category')}>
                {t('btnBack')}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default UpdateProductCategory;
