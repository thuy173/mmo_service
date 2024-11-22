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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, useDispatch } from 'src/store/Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto } from '@tabler/icons';
import {
  fetchPostCategory,
  updateExistingPostCategory,
} from 'src/store/apps/postCategory/PostCategorySlice';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UpdatePostCategory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const categoryId = id ? parseInt(id, 10) : 0;

  const category = useSelector((state: RootState) =>
    state.postCategories.postCategory.find((category) => category.id === categoryId),
  );

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/post-category">
      {t('postCategory.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('postCategory.breadcrumbUpdate')}
    </Typography>,
  ];

  useEffect(() => {
    if (!category) {
      dispatch(fetchPostCategory());
    }
  }, [dispatch, category]);

  const formik = useFormik({
    initialValues: {
      id: category?.id || 0,
      name: category?.name || '',
      image: category?.image as File | string | undefined,
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
      updatedFormData.append('description', values.description);
      updatedFormData.append('active', values.active.toString());

      if (values.image instanceof File) {
        updatedFormData.append('image', values.image);
      }

      try {
        await dispatch(updateExistingPostCategory(updatedFormData));
        navigate('/post-category');
      } catch (error) {
        console.error('Error updating post category:', error);
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
            <TextField
              label={t('postCategory.name')}
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
                      formik.setFieldValue('image', file);
                    }
                  }}
                />
                <IconPhoto />
              </IconButton>
              {formik.values.image && (
                <img
                  src={
                    typeof formik.values.image === 'string'
                      ? formik.values.image
                      : URL.createObjectURL(formik.values.image)
                  }
                  alt="Icon"
                  width={40}
                  height={40}
                />
              )}
            </Box>
            <TextField
              label={t('postCategory.description')}
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
              label={t('postCategory.active')}
            />
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {t('btnSave')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/post-category')}>
                {t('btnBack')}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default UpdatePostCategory;
