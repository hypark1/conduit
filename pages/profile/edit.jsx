import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Grid, Typography} from '@material-ui/core';
import API from '@modules/API';
import ErrorSet from '@modules/ErrorSet';
import {validateEmail} from '@modules/CheckValidation';
import Header from '@component/header';

const ProfileEdit = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = useCallback(() => {
    API({
      method: 'GET',
      url: '/user'
    })
      .then((response) => {
        if (response.request.status === 200) {
          let user = response.data.user;
          setName(user.username);
          setEmail(user.email);
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, []);

  const putUserUpdate = useCallback(() => {
    let data = {
      user: {
        email: email,
        username: name
      }
    };
    API({
      method: 'PUT',
      data: data,
      url: '/user'
    })
      .then((response) => {
        if (response.request.status === 200) {
          alert('수정이 완료되었습니다.');
          router.push('/profile');
        }
      })
      .catch((error) => {
        if (error.request.status === 422) {
          alert('이름, 이메일을 확인해주세요.');
        } else {
          ErrorSet(error, router);
        }
      });
  }, [name, email]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (name && validateEmail(email) === '') {
        putUserUpdate();
      } else {
        alert('이름, 이메일을 알맞게 입력하세요.');
      }
    },
    [name, email]
  );

  const onChangeName = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const onChangeEmail = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h4" className={'title'}>
          프로필 수정하기
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12} className={'centerBox'}>
            <img src="https://placeimg.com/200/200/people" alt={'username'} className={'profileImg'} />
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
            <Button type="submit" variant="contained" color="primary">
              수정하기
            </Button>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default ProfileEdit;
