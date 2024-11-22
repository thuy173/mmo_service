import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Link,
  Breadcrumbs,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, useDispatch } from 'src/store/Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { fetchProductById, updateExistingProduct } from 'src/store/apps/product/ProductSlice';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto } from '@tabler/icons';
import { Link as RouterLink } from 'react-router-dom';
import { LiveAccountStatus } from 'src/types/apps/liveAccountStatus';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchFullProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

const UpdateProduct: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fullProductCategory } = useSelector((state: any) => state.subProductCategories);
  const product = useSelector((state: RootState) => state.products.productDetail);

  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const productId = id ? parseInt(id, 10) : 0;

  const liveAccountStatusOptions = Object.values(LiveAccountStatus);
  const defaultStatus = LiveAccountStatus.NONE;

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/product">
      {t('product.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('product.breadcrumbUpdate')}
    </Typography>,
  ];

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.image) {
      setImagePreview(product.image as string);
    }
  }, [product]);

  useEffect(() => {
    dispatch(fetchFullProductCategory());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: product?.id || 0,
      name: product?.name || '',
      subProductCategoryId: product?.productSubCategory.id || '',
      sellPrice: product?.sellPrice || 0,
      capitalPrice: product?.capitalPrice || 0,
      discount: product?.discount || 0,
      checkLiveAccountStatus: product?.checkLiveAccountStatus || 0,
      maxPurchaseQuantity: product?.maxPurchaseQuantity || 0,
      minPurchaseQuantity: product?.minPurchaseQuantity || 0,
      countryCode: product?.countryCode || 0,
      priorityNum: product?.priorityNum || 0,
      shortDescription: product?.shortDescription || '',
      detailDescription: product?.detailDescription || '',
      noteFileTxt: product?.noteFileTxt || '',
      image: product?.image as File | string | undefined,
      active: product?.active || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      sellPrice: Yup.number()
        .min(0, 'Sell price must be greater than or equal to 0')
        .required('Sell price is required'),
      shortDescription: Yup.string().required('Short description is required'),
    }),
    onSubmit: async (values) => {
      const updatedFormData = new FormData();
      updatedFormData.append('id', values.id.toString());
      updatedFormData.append('subProductCategoryId', values.subProductCategoryId.toString());
      updatedFormData.append('name', values.name);
      updatedFormData.append('sellPrice', values.sellPrice.toString());
      updatedFormData.append('capitalPrice', values.capitalPrice.toString());
      updatedFormData.append('discount', values.discount.toString());
      updatedFormData.append('checkLiveAccountStatus', values.checkLiveAccountStatus.toString());
      updatedFormData.append('minPurchaseQuantity', values.minPurchaseQuantity.toString());
      updatedFormData.append('maxPurchaseQuantity', values.maxPurchaseQuantity.toString());
      updatedFormData.append('countryCode', values.countryCode.toString());
      updatedFormData.append('priorityNum', values.priorityNum.toString());
      updatedFormData.append('noteFileTxt', values.noteFileTxt);
      updatedFormData.append('shortDescription', values.shortDescription);
      updatedFormData.append('detailDescription', values.detailDescription);
      updatedFormData.append('active', values.active.toString());

      if (values.image instanceof File) {
        updatedFormData.append('image', values.image);
      }

      try {
        await dispatch(updateExistingProduct(updatedFormData));
        navigate('/product');
      } catch (error) {
        console.error('Error updating product:', error);
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
              label={t('product.name')}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              sx={{ mt: 3 }}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="sell-price">{t('product.sellPrice')}</InputLabel>
                <OutlinedInput
                  id="sell-price"
                  type="number"
                  name="sellPrice"
                  value={formik.values.sellPrice}
                  endAdornment={
                    <InputAdornment position="end">{t('product.currency')}</InputAdornment>
                  }
                  aria-describedby="sell-price"
                  inputProps={{
                    'aria-label': 'sell-price',
                  }}
                  label={t('product.sellPrice')}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="capital-price">{t('product.capitalPrice')}</InputLabel>
                <OutlinedInput
                  id="capital-price"
                  label={t('product.capitalPrice')}
                  type="number"
                  name="capitalPrice"
                  value={formik.values.capitalPrice}
                  endAdornment={
                    <InputAdornment position="end">{t('product.currency')}</InputAdornment>
                  }
                  aria-describedby="capital-price"
                  inputProps={{
                    'aria-label': 'capital-price',
                  }}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="discount">{t('product.discount')}</InputLabel>
                <OutlinedInput
                  label={t('product.discount')}
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
            <Stack direction="row" spacing={2} mt={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label">{t('product.category')}</InputLabel>
                <Select
                  labelId="category-label"
                  {...formik.getFieldProps('subProductCategoryId')}
                  value={formik.values.subProductCategoryId || ''}
                  onChange={(event) =>
                    formik.setFieldValue('subProductCategoryId', event.target.value)
                  }
                  label={t('product.category')}
                >
                  {fullProductCategory.flatMap((category: any) => [
                    <MenuItem key={`category-${category.id}`} disabled>
                      {category.name}
                    </MenuItem>,
                    ...category.subProductCategories.map((subCategory: any) => (
                      <MenuItem key={`subcategory-${subCategory.id}`} value={subCategory.id}>
                        {`__${subCategory.name}`}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>
              <TextField
                label={t('product.minPurchase')}
                {...formik.getFieldProps('minPurchaseQuantity')}
                fullWidth
              />
              <TextField
                label={t('product.maxPurchase')}
                {...formik.getFieldProps('maxPurchaseQuantity')}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="checkLiveAccountStatus-label">{t('product.checkLive')}</InputLabel>
                <Select
                  labelId="checkLiveAccountStatus-label"
                  id="checkLiveAccountStatus"
                  {...formik.getFieldProps('checkLiveAccountStatus')}
                  label={t('product.checkLive')}
                  defaultValue={defaultStatus}
                >
                  {liveAccountStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="active-label">{t('product.active')}</InputLabel>
                <Select label="Status" {...formik.getFieldProps('active')} fullWidth>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t('product.countryCode')}
                {...formik.getFieldProps('countryCode')}
                fullWidth
              />
              <TextField
                label={t('product.priorityNum')}
                fullWidth
                {...formik.getFieldProps('priorityNum')}
                margin="normal"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() =>
                          formik.setFieldValue(
                            'priorityNum',
                            Math.max(Number(formik.values.priorityNum) - 1, 0),
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
                          formik.setFieldValue('priorityNum', Number(formik.values.priorityNum) + 1)
                        }
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps: {
                    style: { textAlign: 'center' },
                  },
                }}
              />
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <input
                accept="image/*"
                type="file"
                id="image"
                name="image"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    formik.setFieldValue('image', file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor="image">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <IconPhoto />
                </IconButton>
              </label>
              {imagePreview && (
                <Box mt={2}>
                  <img src={imagePreview} alt="Product Preview" width={200} height="auto" />
                </Box>
              )}
            </Box>
            <TextField
              label={t('product.shortDescription')}
              name="shortDescription"
              value={formik.values.shortDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
              helperText={formik.touched.shortDescription && formik.errors.shortDescription}
            />

            <Box mt={1}>
              <Typography>{t('product.description')}</Typography>
              <ReactQuill
                modules={modules}
                formats={formats}
                value={formik.values.detailDescription}
                onChange={(value) => formik.setFieldValue('detailDescription', value)}
              />
            </Box>

            <TextField
              label={t('product.noteFile')}
              value={formik.values.noteFileTxt}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={1}
            />

            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {t('btnSave')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/product')}>
                {t('btnBack')}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default UpdateProduct;
