import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { AsyncStorage } from 'react-native';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import uuid from 'react-native-uuid';
import { defaultState, rootReducer } from './reducer';
import {reduxPersistKey} from '../utils/constants';

const migrations = {
  0: state => ({
    ...state,
    availableTokens: state.availableTokens.map(token => ({
      ...token,
      id: uuid.v4(),
    })),
  }),
};

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'xdcwallet',
  sharedPreferencesName: 'xdcwallet',
});

const persistConfig = {
  timeout: null,
  key: reduxPersistKey,
  version: 2,
  storage: AsyncStorage,
  migrate: createMigrate(migrations, { debug: true }),
};

const store = createStore(
  persistReducer(persistConfig, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? undefined
    : applyMiddleware(createLogger()),
);

const persistor = persistStore(store)

export { persistor, store };
