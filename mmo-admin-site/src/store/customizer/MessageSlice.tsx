import { createSlice } from '@reduxjs/toolkit';

interface StateType {
  message: string;
  open: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
}

const initialState: StateType = {
  message: '',
  open: false,
  severity: 'success',
};

export const MessageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.open = true;
      state.severity = action.payload.severity || 'success';
    },
    clearMessage: (state) => {
      state.message = '';
      state.open = false;
      state.severity = 'success';
    },
  },
});
export const { setMessage, clearMessage } = MessageSlice.actions;

export default MessageSlice.reducer;
