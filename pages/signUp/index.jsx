import React, {useCallback} from 'react';
import {useRouter} from 'next/router';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Grid, Typography} from '@material-ui/core';
import SetInput from '@modules/SetInput';
import ErrorSet from '@modules/ErrorSet';
import API from '@modules/API';
import {validateEmail, validatePassword} from '@modules/CheckValidation';

const SingUp = () => {
  const [name, onChangeName] = SetInput('');
  const [email, onChangeEmail] = SetInput('');
  const [password, onChangePassword] = SetInput('');
  const router = useRouter();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (name && validateEmail(email) === '' && validatePassword(password) === '') {
        postUserSignup();
      } else {
        alert('이름, 이메일, 비밀번호를 알맞게 입력하세요.');
      }
    },
    [name, email, password]
  );

  const postUserSignup = useCallback(() => {
    let data = {
      user: {
        username: name,
        email: email,
        password: password
      }
    };
    API({
      method: 'POST',
      data: data,
      url: '/users'
    })
      .then((response) => {
        if (response.request.status === 200) {
          alert('회원가입이 완료되었습니다.')
          router.push('/login');
        }
      })
      .catch((error) => {
        if (error.request.status === 422) {
          alert('이름, 이메일, 비밀번호를 확인해주세요.');
        } else {
          ErrorSet(error, router);
        }
      });
  }, [name, email, password]);

  return (
    <>
      <Container component="main" maxWidth="xs" className={'login'}>
        <Typography component="h1" variant="h4" className={'title'}>
          회원가입
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <TextField autoComplete="name" name="name" variant="outlined" id="name" label="이름" value={name} onChange={onChangeName} required fullWidth autoFocus />
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
            />
            <TextField
              autoComplete="password"
              name="password"
              variant="outlined"
              type="password"
              id="password"
              label="비밀번호"
              value={password}
              onChange={onChangePassword}
              error={validatePassword(password) ? true : false}
              helperText={validatePassword(password)}
              required
              fullWidth
            />
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={'button'}>
            가입하기
          </Button>
        </form>
      </Container>
    </>
  );
};

export default SingUp;
