import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import sessionReducer from 'features/session/sessionSlice';
import chatReducer from 'features/chat/chatSlice';
import rootSaga from 'sagas';

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: true }), sagaMiddleware];

export default configureStore({
  reducer: {
    session: sessionReducer,
    chat: chatReducer,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);
