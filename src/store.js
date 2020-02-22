import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import counterReducer from 'features/counter/counterSlice';
import sessionReducer from 'features/session/sessionSlice';
import rootSaga from 'sagas';

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: true }), sagaMiddleware];

export default configureStore({
  reducer: {
    counter: counterReducer,
    session: sessionReducer,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);
