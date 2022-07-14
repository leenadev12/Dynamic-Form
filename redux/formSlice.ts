import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from './store';

export type CounterState = {
  value: { [key: string]: string | number };
  response: { [key: string]: string | number }
  error: string
};

const initialState: CounterState = {
  value: {},
  response: {},
  error: ""
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    formPayload: (state, action) => {
      state.value = action.payload;
    },
    formValues: (state, action) => {
      state.response = action.payload;
    },
    formError: (state, action) => {
      state.error = action.payload
    }
  },
}
);

export const {
  formValues, formPayload, formError
} = formSlice.actions;

export const selectPayload = (state: RootState) => state.form.value;
export const selectResponse = (state: RootState) => state.form.response;
export const selectError = (state: RootState) => state.form.error;

export default formSlice.reducer;
