export const SET_USER = 'SET_LOAD';
export const IS_LOGIN = 'IS_LOGIN';

export const setUserAction = (data) => {
  return {
    type: SET_USER,
    payload: data
  };
};

export const IsLoginAction = (data) => {
  return {
    type: IS_LOGIN,
    payload: data
  };
};
