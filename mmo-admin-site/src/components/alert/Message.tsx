import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from 'src/store/customizer/MessageSlice';
import { RootState } from 'src/store/Store';
import CustomAlert from './CustomAlert';


const MessageContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { message, open, severity } = useSelector((state: RootState) => state.messages);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(clearMessage());
  };

  return (
    <CustomAlert
      open={open}
      onClose={handleClose}
      message={message}
      severity={severity}
    />
  );
};

export default MessageContainer;