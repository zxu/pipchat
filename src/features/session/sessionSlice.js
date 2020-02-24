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
  name: 'session',
  initialState: {
    peers: [],
    peer: null,
    user: null,
    token: null,
  },
  reducers: {
    checkinStart: startLoading,
    checkinFailure: loadingFailed,
    checkinSuccess(state, { payload }) {
      state.peers = payload.peers;
      state.isLoading = false;
      state.user = payload.user;
      state.token = payload.token;
    },
    wsConnected(state) {
      state.wsConnected = true;
    },
    choosePeer(state, { payload }) {
      console.log('payload', payload);
      state.peer = payload;
    },
    send(state, { payload }) {
      console.log(payload);
    },
    receivePeerList(state, { payload }) {
      state.peers = payload.peers;
    },
  },
});

export const {
  checkinStart, checkinFailure, checkinSuccess, wsConnected, choosePeer, send, receivePeerList,
} = slice.actions;

export const checkin = ({ token, user }) => async (dispatch) => {
  try {
    dispatch(checkinStart());
    const data = await checkinWithServer({ token, user });
    dispatch(checkinSuccess({ ...data, token, user }));
  } catch (err) {
    dispatch(checkinFailure(err.toString()));
  }
};

export const reCheckin = () => async (dispatch, getState) => {
  const { session: { user, token } } = getState();
  if (user && token) {
    try {
      dispatch(checkinStart());
      const data = await checkinWithServer({ token, user });
      dispatch(checkinSuccess({ ...data, user, token }));
    } catch (err) {
      dispatch(checkinFailure(err.toString()));
    }
  }
};
export default slice.reducer;
