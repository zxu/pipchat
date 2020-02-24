/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    conversation: {},
  },
  reducers: {
    send(state, { payload }) {
      console.log(payload);

      const { peer } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
    },
    receive(state, { payload }) {
      const { self: peer } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
    },
  },
});

export const {
  send, receive,
} = slice.actions;

export default slice.reducer;
