import React, {useCallback, useEffect} from 'react';
import {wrapper} from '@redux/reducers';
import '@styles/globals.scss';
import {IsLoginAction, setUserAction} from '@redux/actions';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import API from '@modules/API';
import ErrorSet from '@modules/ErrorSet';

const MyApp = ({Component, pageProps}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(async () => {
    let token = await localStorage.getItem('hyparkToken');
    if (token) {
      dispatch(IsLoginAction(true));
      getUser();
    }
  }, []);

  const getUser = useCallback(() => {
    API({
      method: 'GET',
      url: '/user'
    })
      .then((response) => {
        if (response.request.status === 200) {
          let userData = response.data.user;
          dispatch(setUserAction(userData));
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, []);

  return <Component {...pageProps} />;
};

export default wrapper.withRedux(MyApp);
