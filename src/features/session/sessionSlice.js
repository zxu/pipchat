/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { checkinWithServer } from 'api/chatAPI';

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

export const slice = createSlice({
  name: 'conversations',
  initialState: {
    peers: [],
  },
  reducers: {
    checkinStart: startLoading,
    checkinFailure: loadingFailed,
    checkinSuccess(state, { payload }) {
      state.peers = payload.peers;
      state.isLoading = false;
    },
    wsConnected(state) {
      state.wsConnected = true;
    },
  },
});

export const { checkinStart, checkinFailure, checkinSuccess, wsConnected } = slice.actions;

export const checkin = ({ token, user }) => async (dispatch) => {
  try {
    dispatch(checkinStart());
    const data = await checkinWithServer({ token, user });
    dispatch(checkinSuccess(data));
  } catch (err) {
    dispatch(checkinFailure(err.toString()));
  }
};
export default slice.reducer;
