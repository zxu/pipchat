import { eventChannel } from 'redux-saga';
import {
  call, put, take, all,
} from 'redux-saga/effects';
import io from 'socket.io-client';
import { baseURL } from 'utils/env';
import {
  checkinSuccess, wsConnected, receivePeerList, reCheckin, choosePeer,
} from 'features/session/sessionSlice';
import { send, receive } from 'features/chat/chatSlice';

// import { GAME } from 'actions/types';
// import { gameJoined, serverConnected } from 'actions';

// let ws;
// let savedSessionInfo;
//
// export const getPlayer = (state) => state.game.player;
//
// function sendMessage(action) {
//   ws.send(JSON.stringify(action));
// }
//
// function initWebsocket() {
//   return eventChannel((emitter) => {
//     ws = new WebSocket(`wss://${process.env.REACT_APP_GAME_SERVER_HOST}:${process.env.REACT_APP_GAME_SERVER_PORT}/`);
//
//     ws.onopen = () => {
//       console.log('Connection to server opened.');
//       emitter(serverConnected());
//     };
//
//     ws.onerror = (error) => {
//       console.log('WebSocket error.', error);
//       emitter(serverConnected(false));
//     };
//
//     ws.onmessage = (message) => {
//       try {
//         console.log('=============================');
//         console.log('Raw message received:', message);
//         console.log('=============================');
//
//         const payload = JSON.parse(message.data);
//         if (payload.type) {
//           emitter(payload);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };
//
//     ws.onclose = (event) => {
//       console.log('Connection closed.', event);
//       emitter(serverConnected(false));
//     };
//
//     // unsubscribe function
//     return () => {
//       ws.terminate();
//     };
//   });
// }
//
// function saveSessionInfo({ sessionID, player }) {
//   sessionStorage.setItem('sessionID', sessionID);
//   sessionStorage.setItem('player', player);
//   savedSessionInfo = { sessionID, player };
// }
//
// function retrieveSessionInfo() {
//   return {
//     sessionID: sessionStorage.getItem('sessionID'),
//     player: sessionStorage.getItem('player'),
//   };
// }
//

let socket;

const sendMessage = ({ self, peer, message }) => {
  socket.emit('chat/message', { self, peer, message });
};

const initWebsocket = () => eventChannel((emitter) => {
  socket = io(baseURL(process.env.NODE_ENV));

  socket.on('connect', () => {
    console.log('Connected');
    emitter(wsConnected());
  });

  socket.on('connect', () => {
    console.log('Connected and re-checkin');
    setTimeout(() => {
      emitter(reCheckin());
    }, Math.random() * 10000);
  });

  socket.on('welcome', (data) => {
    console.log('ws data', data);
    if ('peers' in data) {
      emitter(receivePeerList(data));
    }
  });

  socket.on('chat/message', (data) => {
    console.log('chat/message', data);
    emitter(receive(data));
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
        const { payload: { self: peer } } = action;
        console.log('Received message from', peer);
        yield all([put(choosePeer(peer)), put(action)]);
      }
        break;
      default: {
        console.log('ws channel action', action);
        yield put(action);
      }
    }
  }
}

export function* watchOutboundWSMessages() {
  while (true) {
    const action = yield take([checkinSuccess, send]);

    console.log('Saga action', action);

    if (action.type === checkinSuccess.type) {
      console.log('Checkin Success');
      const { payload: { user } } = action;
      yield call(sendMessage, { self: user.sub });
    }

    if (action.type === send.type) {
      console.log('Peer message');
      yield call(sendMessage, action.payload);
    }

    // if (!savedSessionInfo) {
    //   savedSessionInfo = yield call(retrieveSessionInfo);
    // }
    // console.log('Saved Session Info', savedSessionInfo);
    //
    // const player = yield select(getPlayer);
    // if (!('player' in action) || action.player === player) {
    //   yield fork(sendMessage, { ...action, ...savedSessionInfo });
    // }
  }
}
