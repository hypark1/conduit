import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Button, Container, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import API from '@modules/API';
import ErrorSet from '@modules/ErrorSet';
import Header from '@component/header';

const Profile = () => {
  const [user, setUser] = useState({});
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
          setUser(response.data.user);
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, []);

  const updateUser = useCallback(() => {
    router.push('/profile/edit');
  }, []);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h4" className={'title'}>
          프로필
        </Typography>
        <Box className={'centerBox'}>
          <img src="https://placeimg.com/200/200/people" alt={'username'} className={'profileImg'} />
          <Typography variant="h4">{user.username}</Typography>
          <Typography variant="h5">{user.email}</Typography>
          <Button variant="contained" color="primary" onClick={() => updateUser()}>
            수정
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Profile;
