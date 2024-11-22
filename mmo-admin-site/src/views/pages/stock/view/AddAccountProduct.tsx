import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { IconX } from '@tabler/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addAccountText, fetchAccountInStock } from 'src/store/apps/stock/StockSlice';
import { useDispatch } from 'src/store/Store';
import Spinner from 'src/views/spinner/Spinner';

interface AddAccountDialogProps {
  productId: number;
  open: boolean;
  handleClose: () => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, handleClose, productId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [accountText, setAccountText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAccount = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('account', accountText);

    try {
      await dispatch(addAccountText(formData));
      dispatch(fetchAccountInStock(productId));
      setAccountText('');
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
          <DialogTitle>{t('stock.titleAdd')}</DialogTitle>
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
            <TextField
              placeholder="user|password"
              multiline
              rows={6}
              fullWidth
              value={accountText}
              onChange={(e) => setAccountText(e.target.value)}
              variant="outlined"
            />
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

export default AddAccountDialog;
