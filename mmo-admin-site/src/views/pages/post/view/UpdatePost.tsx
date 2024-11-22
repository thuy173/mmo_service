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
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, useDispatch } from 'src/store/Store';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Spinner from 'src/views/spinner/Spinner';
import { IconPhoto } from '@tabler/icons';
import { Link as RouterLink } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchPostCategory } from 'src/store/apps/postCategory/PostCategorySlice';
import { fetchPostById, updateExistingPost } from 'src/store/apps/post/PostSlice';
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

const UpdatePost: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { postCategory } = useSelector((state: any) => state.postCategories);
  const postDetail = useSelector((state: RootState) => state.posts.postDetail);

  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const postId = id ? parseInt(id, 10) : 0;

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" component={RouterLink} to="/post">
      {t('post.breadcrumbSub')}
    </Link>,
    <Typography key="3" color="text.primary">
      {t('post.breadcrumbUpdate')}
    </Typography>,
  ];

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (postDetail?.thumbnail) {
      setImagePreview(postDetail.thumbnail as string);
    }
  }, [postDetail]);

  useEffect(() => {
    dispatch(fetchPostCategory());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: postDetail?.id || 0,
      postCategoryId: postDetail?.postCategory.id || 0,
      title: postDetail?.title || '',
      shortContent: postDetail?.shortContent || '',
      content: postDetail?.content || '',
      thumbnail: postDetail?.thumbnail as File | string | undefined,
      active: postDetail?.active || false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      shortContent: Yup.string().required('Short content is required'),
    }),
    onSubmit: async (values) => {
      const updatedFormData = new FormData();
      updatedFormData.append('id', values.id.toString());
      updatedFormData.append('postCategoryId', values.postCategoryId.toString());
      updatedFormData.append('title', values.title);
      updatedFormData.append('shortContent', values.shortContent);
      updatedFormData.append('content', values.content);
      updatedFormData.append('active', values.active.toString());

      if (values.thumbnail instanceof File) {
        updatedFormData.append('thumbnail', values.thumbnail);
      }

      try {
        await dispatch(updateExistingPost(updatedFormData));
        navigate('/post');
      } catch (error) {
        console.error('Error updating post:', error);
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
              label={t('post.title')}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <Stack direction="row" spacing={2} mt={2}>
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
            <Stack direction="row" spacing={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel id="active-label">{t('post.active')}</InputLabel>
                <Select label="Status" {...formik.getFieldProps('active')} fullWidth>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <input
                accept="image/*"
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    formik.setFieldValue('thumbnail', file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor="thumbnail">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <IconPhoto />
                </IconButton>
              </label>
              {imagePreview && (
                <Box mt={2}>
                  <img src={imagePreview} alt="Post Preview" width={200} height="auto" />
                </Box>
              )}
            </Box>
            <TextField
              label={t('post.shortContent')}
              name="shortContent"
              value={formik.values.shortContent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              multiline
              rows={1}
              error={formik.touched.shortContent && Boolean(formik.errors.shortContent)}
              helperText={formik.touched.shortContent && formik.errors.shortContent}
            />

            <Box mt={1}>
              <Typography>{t('post.content')}</Typography>
              <ReactQuill
                modules={modules}
                formats={formats}
                value={formik.values.content}
                onChange={(value) => formik.setFieldValue('content', value)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {t('btnSave')}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/post')}>
                {t('btnBack')}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default UpdatePost;
