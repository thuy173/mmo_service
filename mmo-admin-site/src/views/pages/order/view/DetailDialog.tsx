import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DetailDialogProps {
  open: boolean;
  handleClose: () => void;
  account: string;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, handleClose, account }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('order.titleDialog')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{account}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('btnCancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
