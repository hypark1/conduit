import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Button} from '@material-ui/core';
import {useRouter} from '@node_modules/next/router';

/*로그인 후 헤더*/
const Header = () => {
  const isLogin = useSelector((store) => store.isLogin);
  const router = useRouter();

  const goHome = useCallback(() => {
    router.push('/articles');
  }, []);

  const goProfile = useCallback(() => {
    router.push('/profile');
  }, []);

  const goSignIn = useCallback(() => {
    router.push('/login');
  }, []);
  
  const goSignOut = useCallback(() => {
    if (confirm('로그아웃 하겠습니까?')) {
      localStorage.removeItem('hyparkToken');
      router.push('/login');
    }
  }, []);

  return (
    <>
      <div className={'headerBox'}>
        <Button variant="outlined" onClick={goHome}>
          Home
        </Button>
        {isLogin ? (
          <>
            <Button variant="outlined" color="primary" onClick={goProfile}>
              Profile
            </Button>
            <Button variant="outlined" color="secondary" onClick={goSignOut}>
              SignOut
            </Button>
          </>
        ) : (
          <Button variant="outlined" color="secondary" onClick={goSignIn}>
            SignIn
          </Button>
        )}
      </div>
    </>
  );
};

export default Header;
