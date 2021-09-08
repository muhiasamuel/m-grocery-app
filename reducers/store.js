import{ createStore } from 'redux';
import productReducers from './productReducers';

      
const store = createStore(productReducers);

export default store;