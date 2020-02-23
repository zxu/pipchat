import { eventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import io from 'socket.io-client';
import { baseURL } from 'utils/env';
import { checkinSuccess, wsConnected, send } from 'features/session/sessionSlice';

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

  socket.on('welcome', (data) => {
    console.log('ws data', data);
  });

  socket.on('chat/message', (data) => {
    console.log('chat/message', data);
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
      // case GAME.GAME_JOINED: {
      //   const session = {
      //     ...action,
      //     sessionID: parseInt(action.sessionID, 10),
      //     player: parseInt(action.player, 10),
      //   };
      //   yield call(saveSessionInfo, session);
      //   yield put(gameJoined(session));
      //   break;
      // }
      // case GAME.CONNECTED:
      //   console.log('Connection state changed.');
      //   yield put(serverConnected(action.connected));
      //   break;
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
      const { payload: { self } } = action;
      yield call(sendMessage, { self });
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
