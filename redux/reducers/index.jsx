import {SET_USER, IS_LOGIN} from '../actions';
import {createStore} from 'redux';
import {createWrapper} from 'next-redux-wrapper';

export const initState = {
  user: {},
  isLogin: false
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case IS_LOGIN:
      return {
        ...state,
        isLogin: action.payload
      };
    default:
      return state;
  }
};

const makeStore = (context) => createStore(reducer);

export const wrapper = createWrapper(makeStore, {debug: true});
