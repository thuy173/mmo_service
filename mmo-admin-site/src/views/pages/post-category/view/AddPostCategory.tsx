import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { useNavigate } from 'react-router';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto, IconPlus } from '@tabler/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PostCategoryDto } from 'src/types/apps/postCategory';
import { addNewPostCategory } from 'src/store/apps/postCategory/PostCategorySlice';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const AddPostCategory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/post-category">
      {t('postCategory.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('postCategory.breadcrumbAdd')}
    </Typography>,
  ];
  
  const validationSchema = Yup.object({
    categoryName: Yup.string().required('Product category name is required'),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      descriptionSEO: '',
      status: 'true',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.categoryName);
      if (icon) {
        formData.append('image', icon);
      }
      formData.append('description', values.descriptionSEO);
      formData.append('active', values.status);

      try {
        await dispatch(addNewPostCategory(formData as unknown as PostCategoryDto));
        navigate('/post-category');
      } catch (error) {
        console.error('Error adding post category:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setIcon(selectedFile);
      setIconPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>

          <TextField
            label={t('postCategory.name')}
            required
            {...formik.getFieldProps('categoryName')}
            error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
            helperText={formik.touched.categoryName && formik.errors.categoryName}
            fullWidth
            margin="normal"
          />

          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
            <IconButton color="primary" component="label">
              <input
                hidden
                accept="image/*"
                type="file"
                id="icon-upload"
                onChange={handleIconChange}
              />
              <IconPhoto />
            </IconButton>
            {iconPreview && (
              <div>
                <Avatar src={iconPreview} alt="Icon" />
              </div>
            )}
          </Box>

          <TextField
            label={t('postCategory.description')}
            {...formik.getFieldProps('descriptionSEO')}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <FormLabel component="legend">{t('postCategory.active')}</FormLabel>
              <RadioGroup aria-label="status" {...formik.getFieldProps('status')} row>
                <FormControlLabel value="true" control={<Radio />} label="Active" />
                <FormControlLabel value="false" control={<Radio />} label="Inactive" />
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
              {t('postCategory.btnSubmit')}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default AddPostCategory;
