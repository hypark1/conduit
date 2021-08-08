import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import {IsLoginAction, setUserAction} from '@redux/actions';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Grid, Typography} from '@material-ui/core';
import SetInput from '@modules/SetInput';
import ErrorSet from '@modules/ErrorSet';
import API from '@modules/API';
import {validateEmail, validatePassword} from '@modules/CheckValidation';

const Login = () => {
  const [email, onChangeEmail] = SetInput('');
  const [password, onChangePassword] = SetInput('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validateEmail(email) === '' && validatePassword(password) === '') {
        postLogin();
      } else {
        alert('이메일과 비밀번호를 알맞게 입력하세요.');
      }
    },
    [email, password]
  );

  const postLogin = useCallback(() => {
    let data = {
      user: {
        email: email,
        password: password
      }
    };
    API({
      method: 'POST',
      data: data,
      url: '/users/login'
    })
      .then((response) => {
        if (response.request.status === 200) {
          let userData = response.data.user;
          localStorage.setItem('hyparkToken', userData.token);
          dispatch(setUserAction(userData));
          dispatch(IsLoginAction(true));
          router.push('/articles');
        }
      })
      .catch((error) => {
        if (error.request.status === 422) {
          alert('이메일과 비밀번호를 확인해주세요.');
        } else {
          ErrorSet(error, router);
        }
      });
  }, [email, password]);

  const goSignUp = useCallback(() => {
    router.push('/signUp');
  }, []);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h4" className={'title'}>
          로그인
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <TextField
              autoComplete="email"
              name="email"
              variant="outlined"
              id="email"
              label="이메일"
              value={email}
              onChange={onChangeEmail}
              error={validateEmail(email) ? true : false}
              helperText={validateEmail(email)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              autoComplete="password"
              name="password"
              variant="outlined"
              type="password"
              id="password"
              label="비밀번호"
              error={validatePassword(password) ? true : false}
              helperText={validatePassword(password)}
              value={password}
              onChange={onChangePassword}
              required
              fullWidth
            />
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={'button'}>
            로그인
          </Button>
        </form>
        <div style={{textAlign: 'right', marginTop: '20px'}}>
          <Button variant="outlined" onClick={goSignUp}>
            회원가입
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Login;
