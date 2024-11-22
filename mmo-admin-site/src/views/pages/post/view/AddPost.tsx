import React, { useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
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
import { Link as RouterLink } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PostDto } from 'src/types/apps/post';
import { addNewPost } from 'src/store/apps/post/PostSlice';
import { fetchPostCategory } from 'src/store/apps/postCategory/PostCategorySlice';
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

const AddPost: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postCategory } = useSelector((state: any) => state.postCategories);
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/post">
      {t('post.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('post.breadcrumbAdd')}
    </Typography>,
  ];

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    postCategoryId: Yup.number().required('Category is required'),
  });

  const formik = useFormik({
    initialValues: {
      postCategoryId: 0,
      title: '',
      shortContent: '',
      content: '',
      active: 'true',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('postCategoryId', values.postCategoryId.toString());
      formData.append('title', values.title);
      if (icon) {
        formData.append('thumbnail', icon);
      }
      formData.append('shortContent', values.shortContent);
      formData.append('content', values.content);
      formData.append('active', values.active);

      try {
        await dispatch(addNewPost(formData as unknown as PostDto));
        navigate('/post');
      } catch (error) {
        console.error('Error adding post:', error);
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

  useEffect(() => {
    dispatch(fetchPostCategory());
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
            label={t('post.title')}
            required
            {...formik.getFieldProps('title')}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
            margin="normal"
          />

          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
            <Typography variant="body1">{t('post.thumbnail')}:</Typography>
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
                  alt="thumbnail"
                  style={{ width: 128, objectFit: 'contain' }}
                />
              </div>
            )}
          </Box>

          <TextField
            label={t('post.shortContent')}
            {...formik.getFieldProps('shortContent')}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <Box mt={1}>
            <Typography>{t('post.content')}</Typography>
            <ReactQuill
              value={formik.values.content}
              onChange={(value) => {
                formik.setFieldValue('content', value);
              }}
              modules={modules}
              formats={formats}
              placeholder={t('post.content') ?? undefined}
            />
          </Box>
          <Stack mt={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">{t('post.postCategory')}</InputLabel>
              <Select
                labelId="category-label"
                {...formik.getFieldProps('postCategoryId')}
                value={formik.values.postCategoryId || ''}
                onChange={(event) => formik.setFieldValue('postCategoryId', event.target.value)}
                label={t('post.postCategory')}
              >
                {postCategory.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Box>
              <FormLabel component="legend">{t('post.active')}</FormLabel>
              <RadioGroup aria-label="status" {...formik.getFieldProps('active')} row>
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
              {t('post.btnSubmit')}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default AddPost;
