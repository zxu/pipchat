import { all, fork } from 'redux-saga/effects';

import {
  watchInboundWSMessages,
  watchOutboundWSMessages,
} from 'sagas/websocket';

import { otherSideEffects } from 'sagas/others';

export default function* root() {
  yield all([
    fork(watchInboundWSMessages),
    fork(watchOutboundWSMessages),
    fork(otherSideEffects),
  ]);
}
