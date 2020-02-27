import { eventChannel } from 'redux-saga';
import {
  all, call, put, take,
} from 'redux-saga/effects';
import io from 'socket.io-client';
import { baseURL } from 'utils/env';
import {
  checkinSuccess,
  choosePeer,
  receivedPublicKey,
  receivePeerList,
  reCheckin,
  wsConnected,
} from 'features/session/sessionSlice';
import {
  receive,
  receiveMessage,
  send,
  sendPublicKey,
  receiveAck,
} from 'features/chat/chatSlice';

let socket;

const sendMessage = ({
  self, peer, message, request, publicKey, encryptedMessage, id,
}) => {
  if (encryptedMessage && message) {
    // eslint-disable-next-line no-param-reassign
    message = encryptedMessage;
  }
  socket.emit('chat/message', {
    self, peer, message, request, publicKey, encrypted: !!encryptedMessage, id,
  });
};

const initWebsocket = () => eventChannel((emitter) => {
  socket = io(baseURL(process.env.NODE_ENV));

  socket.on('connect', () => {
    emitter(wsConnected());
  });

  socket.on('connect', () => {
    setTimeout(() => {
      emitter(reCheckin());
    }, Math.random() * 10000);
  });

  socket.on('welcome', (data) => {
    if ('peers' in data) {
      emitter(receivePeerList(data));
    }
  });

  socket.on('chat/message', (data) => {
    emitter(receive(data));
  });

  socket.on('chat/ack', (data) => {
    emitter(receiveAck(data));
  });

  return () => {
    socket.close();
  };
});

export function* watchInboundWSMessages() {
  const channel = yield call(initWebsocket);
  while (true) {
    const action = yield take(channel);
    switch (action.type) {
      case receive.type: {
        const { payload: { self: peer, request, publicKey } } = action;
        if (request && publicKey) {
          // Peer asking for public key
          if (request === 'keyResponse') {
            yield put(receivedPublicKey({ peer, publicKey }));
          } else {
            yield all([
              put(receivedPublicKey({ peer, publicKey })),
              put(sendPublicKey({ peer }))]);
          }
        } else {
          // yield all([put(choosePeer(peer)), put(action)]);
          console.log('Received incoming message', action);
          yield all(
            [put(choosePeer(peer)), put(receiveMessage(action.payload))],
          );
        }
      }
        break;
      default: {
        yield put(action);
      }
    }
  }
}

export function* watchOutboundWSMessages() {
  while (true) {
    const action = yield take([checkinSuccess, send]);

    if (action.type === checkinSuccess.type) {
      const { payload: { user } } = action;
      yield call(sendMessage, { self: user.sub });
    }

    if (action.type === send.type) {
      yield call(sendMessage, action.payload);
    }
  }
}
