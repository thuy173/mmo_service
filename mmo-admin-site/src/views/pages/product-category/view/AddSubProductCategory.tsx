import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { useNavigate, useParams } from 'react-router';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto, IconPlus } from '@tabler/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addNewSubProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { SubProductCategoryDto } from 'src/types/apps/productCategory';
import { Link as RouterLink } from 'react-router-dom';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AddSubProductCategory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/product-category">
      {t('productCategory.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('productCategory.addSub')}
    </Typography>,
  ];

  const validationSchema = Yup.object({
    categoryName: Yup.string().required('Sub category name is required'),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      descriptionSEO: '',
      orderNum: 0,
      status: 'true',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      if (!id) {
        console.error('Error: product category ID is undefined');
        setLoading(false);

        return;
      }
      formData.append('productCategoryId', id);
      formData.append('name', values.categoryName);
      if (icon) {
        formData.append('icon', icon);
      }
      formData.append('description', values.descriptionSEO);
      formData.append('active', values.status);
      formData.append('orderNum', values.orderNum.toString());

      try {
        await dispatch(addNewSubProductCategory(formData as unknown as SubProductCategoryDto));
        navigate('/product-category');
      } catch (error) {
        console.error('Error adding sub category:', error);
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
            label={t('productCategory.subName')}
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
            label={t('productCategory.description')}
            {...formik.getFieldProps('descriptionSEO')}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Stack direction="row" justifyContent="start" alignItems="center" spacing={2} mt={2}>
            <Box>
              <FormLabel component="legend">{t('productCategory.active')}</FormLabel>
              <RadioGroup aria-label="status" {...formik.getFieldProps('status')} row>
                <FormControlLabel value="true" control={<Radio />} label="Active" />
                <FormControlLabel value="false" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </Box>

            <TextField
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
          </Stack>

          <Stack justifyContent="center" alignItems="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 15, width: '50%' }}
              startIcon={<IconPlus />}
            >
              {t('productCategory.btnSubmit')}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default AddSubProductCategory;
