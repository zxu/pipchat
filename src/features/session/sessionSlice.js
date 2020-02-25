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
    keyPair: {},
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
      state.peer = payload;
    },
    receivePeerList(state, { payload }) {
      state.peers = payload.peers;

      // We need to clear out the previously selected peer, because its corresponding
      // public key would have been lost when we receive a new peer list.
      state.peer = null;
    },
    // eslint-disable-next-line no-unused-vars
    loginSuccess(state, { payload }) {
      // This action doesn't need to mutate the state.
      // It's just a signal to trigger the generation of key pairs.
    },
    saveKeyPair(state, { payload }) {
      state.keyPair = payload.keyPair;
    },
    receivedPublicKey(state, { payload }) {
      const { peer, publicKey } = payload;
      const peerToUpdate = state.peers.find((p) => p.id === peer);
      if (peerToUpdate) {
        peerToUpdate.publicKey = publicKey;
      }
    },
  },
});

export const {
  checkinStart, checkinFailure, checkinSuccess, wsConnected, choosePeer,
  send, receivePeerList, loginSuccess, saveKeyPair, receivedPublicKey,
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
