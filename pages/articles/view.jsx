import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {Button, Container, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import API from '@modules/API';
import SetDate from '@modules/SetDate';
import SetTagList from '@modules/SetTagList';
import ErrorSet from '@modules/ErrorSet';
import Header from '@component/header';
import Comments from '@component/articles/comments';

const ArticlesView = () => {
  const [data, setData] = useState({});
  const [mine, setMine] = useState(false);
  const user = useSelector((store) => store.user);
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug) {
      getArticleInfo();
    }
  }, [router.query.slug]);

  const getArticleInfo = useCallback(() => {
    API({
      method: 'GET',
      url: '/articles/' + router.query.slug
    })
      .then((response) => {
        if (response.request.status === 200) {
          let result = response.data.article;
          setData(result);
          if (result.author.username === user.username) {
            setMine(true);
          }
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, [router.query.slug]);

  const deleteArticleBtn = useCallback(() => {
    if (confirm('삭제하겠습니까?')) {
      API({
        method: 'DELETE',
        url: '/articles/' + router.query.slug
      })
        .then((response) => {
          if (response.request.status === 200) {
            alert('삭제가 완료되었습니다.')
            router.push('/articles');
          }
        })
        .catch((error) => {
          ErrorSet(error, router);
        });
    }
  }, [router.query.slug]);

  const updateArticleBtn = useCallback(() => {
    router.push({
      pathname: '/articles/update',
      query: {slug: router.query.slug}
    });
  }, []);

  return (
    <>
      <Header />
      {data.title ? (
        <>
          <Box className={'articleTop'}>
            <Container component="main" maxWidth="md">
              <Box className={'titleText'}>
                <Typography variant={'h2'}>{data.title}</Typography>
              </Box>
              <Box className={'user'}>
                <img src={data.author.image} alt={'username'} className={'profileImg'} />
                <Box className={'userText'}>
                  <Typography variant="subtitle1">{data.author.username}</Typography>
                  <Typography variant="subtitle1">{SetDate(data.createdAt)}</Typography>
                </Box>
              </Box>
            </Container>
          </Box>
          <Box className={'articleBody'}>
            <Container maxWidth="md">
              <Box>
                <Typography variant="h5">{data.description}</Typography>
                <Box style={{margin: '30px 0'}}>
                  <SetTagList data={data.tagList} />
                </Box>
              </Box>
              {mine ? (
                <Box className={'textBox'}>
                  <Button variant="outlined" color="primary" onClick={() => updateArticleBtn()}>
                    수정
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => deleteArticleBtn()}>
                    삭제
                  </Button>
                </Box>
              ) : null}
              <Comments />
            </Container>
          </Box>
        </>
      ) : null}
    </>
  );
};

export default ArticlesView;
