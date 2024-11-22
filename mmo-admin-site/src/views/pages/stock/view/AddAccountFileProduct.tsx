import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { IconX } from '@tabler/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addAccountFile, fetchAccountInStock } from 'src/store/apps/stock/StockSlice';
import { useDispatch } from 'src/store/Store';
import Spinner from 'src/views/spinner/Spinner';

interface AddAccountFileProps {
  productId: number;
  open: boolean;
  handleClose: () => void;
}

const AddAccountFile: React.FC<AddAccountFileProps> = ({ open, handleClose, productId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fileAccount, setFileAccount] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setFileAccount(file);
    } else {
      console.error('Please select a valid .txt file');
    }
  };

  const handleAddAccount = async () => {
    if (!fileAccount) {
      console.error('No file selected');

      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('file', fileAccount);

    try {
      await dispatch(addAccountFile(formData));
      dispatch(fetchAccountInStock(productId));
      setFileAccount(null);
    } catch (error) {
      console.error('Error adding account:', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>{t('stock.titleAddFile')}</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <IconX />
          </IconButton>
          <DialogContent>
            <Box
              component="form"
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <input type="file" accept=".txt" onChange={handleFileChange} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t('btnCancel')}
            </Button>
            <Button onClick={handleAddAccount} color="primary">
              {t('stock.btnSubmit')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AddAccountFile;
