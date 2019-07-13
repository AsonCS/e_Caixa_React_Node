import { combineReducers } from 'redux';
import clientsReducers from './clientsReducers';

export default combineReducers({
    clients : clientsReducers
});
