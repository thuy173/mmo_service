import React, { useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store/Store';
import { useNavigate } from 'react-router';
import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto, IconPlus } from '@tabler/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProductDto } from 'src/types/apps/product';
import { addNewProduct } from 'src/store/apps/product/ProductSlice';
import { LiveAccountStatus } from 'src/types/apps/liveAccountStatus';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchFullProductCategory } from 'src/store/apps/subProductCategory/SubProductCategorySlice';
import { Link as RouterLink } from 'react-router-dom';
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

const AddProduct: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fullProductCategory } = useSelector((state: any) => state.subProductCategories);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const liveAccountStatusOptions = Object.values(LiveAccountStatus);
  const defaultStatus = LiveAccountStatus.NONE;

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/product">
      {t('product.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('product.breadcrumbAdd')}
    </Typography>,
  ];

  const validationSchema = Yup.object({
    subProductCategoryId: Yup.number().required('Category is required'),
    name: Yup.string().required('Product name is required'),
  });

  const formik = useFormik({
    initialValues: {
      subProductCategoryId: 0,
      name: '',
      sellPrice: 0,
      capitalPrice: 0,
      discount: 0,
      checkLiveAccountStatus: defaultStatus,
      minPurchaseQuantity: '',
      maxPurchaseQuantity: '',
      countryCode: '',
      shortDescription: '',
      detailDescription: '',
      noteFileTxt: '',
      image: '',
      priorityNum: 0,
      active: 'true',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Form Values:', values);
      setLoading(true);
      const formData = new FormData();
      formData.append('subProductCategoryId', values.subProductCategoryId.toString());
      formData.append('name', values.name);
      formData.append('sellPrice', values.sellPrice.toString());
      formData.append('capitalPrice', values.capitalPrice.toString());
      formData.append('discount', values.discount.toString());
      formData.append('checkLiveAccountStatus', values.checkLiveAccountStatus);
      formData.append('minPurchaseQuantity', values.minPurchaseQuantity);
      formData.append('maxPurchaseQuantity', values.maxPurchaseQuantity);
      formData.append('countryCode', values.countryCode);
      formData.append('shortDescription', values.shortDescription);
      formData.append('detailDescription', values.detailDescription);
      formData.append('noteFileTxt', values.noteFileTxt);
      formData.append('priorityNum', values.priorityNum.toString());
      formData.append('active', values.active);
      if (image) {
        formData.append('image', image);
      }

      try {
        await dispatch(addNewProduct(formData as unknown as ProductDto));
        navigate('/product');
      } catch (error) {
        console.error('Error adding product:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setIconPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    dispatch(fetchFullProductCategory());
  }, [dispatch]);

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
            label={t('product.name')}
            required
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />
          <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel htmlFor="sell-price">{t('product.sellPrice')}</InputLabel>
              <OutlinedInput
                id="sell-price"
                {...formik.getFieldProps('sellPrice')}
                endAdornment={<InputAdornment position="end">{t('product.currency')}</InputAdornment>}
                aria-describedby="sell-price"
                inputProps={{
                  'aria-label': 'sell-price',
                }}
                label={t('product.sellPrice')}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="capital-price">{t('product.capitalPrice')}</InputLabel>
              <OutlinedInput
                id="capital-price"
                {...formik.getFieldProps('capitalPrice')}
                endAdornment={<InputAdornment position="end">{t('product.currency')}</InputAdornment>}
                aria-describedby="capital-price"
                inputProps={{
                  'aria-label': 'capital-price',
                }}
                label={t('product.capitalPrice')}
              />
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="discount">{t('product.discount')}</InputLabel>
              <OutlinedInput
                id="discount"
                {...formik.getFieldProps('discount')}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="discount"
                inputProps={{
                  'aria-label': 'discount',
                }}
                label={t('product.discount')}
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
                label="Check Live Account Status"
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
            <TextField label={t('product.countryCode')} {...formik.getFieldProps('countryCode')} fullWidth />
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
                <img
                  src={iconPreview}
                  alt="Icon"
                  style={{ width: '100px', objectFit: 'contain', marginLeft: 30 }}
                />
              </div>
            )}
          </Box>

          <TextField
            label={t('product.shortDescription')}
            {...formik.getFieldProps('shortDescription')}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <Box mt={1}>
            <Typography>{t('product.description')}</Typography>
            <ReactQuill
              value={formik.values.detailDescription}
              onChange={(value) => {
                formik.setFieldValue('detailDescription', value);
              }}
              modules={modules}
              formats={formats}
              placeholder={t('product.description') ?? undefined}
            />
          </Box>
          <TextField
            label={t('product.noteFile')}
            {...formik.getFieldProps('noteFileTxt')}
            fullWidth
            margin="normal"
            multiline
            rows={1}
          />

          <Stack justifyContent="center" alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 15, width: '50%' }}
              startIcon={<IconPlus />}
            >
              {t('product.btnSubmit')}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default AddProduct;
