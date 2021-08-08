import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import TextField from '@material-ui/core/TextField';
import {Box, Button, Container, Grid, Typography} from '@material-ui/core';
import API from '@modules/API';
import SetTagList from '@modules/SetTagList';
import ErrorSet from '@modules/ErrorSet';
import Header from '@component/header';

/*아티클 생성,수정*/
const ArticlesCreateUpdate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [tagsList, setTagsList] = useState([]);
  const [routerName, setRouterName] = useState('');
  const router = useRouter();

  useEffect(() => {
    let name = router.pathname;
    setRouterName(name);
    if (name === '/articles/update') {
      getArticleInfo();
    }
  }, [router.query.slug]);

  /*아티클 가져오기*/
  const getArticleInfo = useCallback(() => {
    API({
      method: 'GET',
      url: '/articles/' + router.query.slug
    })
      .then((response) => {
        if (response.request.status === 200) {
          let data = response.data.article;
          setTitle(data.title);
          setDescription(data.description);
          setBody(data.body);
          setTagsList(data.tagList);
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, [router.query.slug]);

  /*등록, 수정 버튼 클릭시*/
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (title && description && body) {
        let data = {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tagsList
          }
        };
        if (routerName === '/articles/update') {
          putArticleUpdate(data);
        } else {
          postArticlesCreate(data);
        }
      } else {
        alert('값을 입력하세요.');
      }
    },
    [title, description, body, tagsList]
  );

  /*생성*/
  const postArticlesCreate = useCallback(
    (data) => {
      API({
        method: 'POST',
        data: data,
        url: '/articles'
      })
        .then((response) => {
          if (response.request.status === 200) {
            alert('생성이 완료되었습니다.')
            router.push('/articles');
          }
        })
        .catch((error) => {
          ErrorSet(error, router);
        });
    },
    [title, description, body, tagsList]
  );

  /*수정*/
  const putArticleUpdate = useCallback(
    (data) => {
      let slug = router.query.slug;
      API({
        method: 'PUT',
        data: data,
        url: '/articles/' + slug
      })
        .then((response) => {
          if (response.request.status === 200) {
            alert('수정이 완료되었습니다.');
            router.push({
              pathname: '/articles/view',
              query: {slug: slug}
            });
          }
        })
        .catch((error) => {
          ErrorSet(error, router);
        });
    },
    [title, description, body, tagsList]
  );

  const onChangeTitle = useCallback((value) => {
    setTitle(value.target.value);
  }, []);

  const onChangeDescription = useCallback((value) => {
    setDescription(value.target.value);
  }, []);

  const onChangeBody = useCallback((value) => {
    setBody(value.target.value);
  }, []);

  const onChangeTag = useCallback((value) => {
    setTags(value.target.value);
  }, []);

  /*태그리스트 설정*/
  const addTagList = useCallback(() => {
    let list = [...tagsList];
    list.push(tags);
    setTagsList(list);
    setTags('');
  }, [tags, tagsList]);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h4" className={'title'}>
          {routerName === '/articles/update' ? '수정하기' : '생성하기'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <TextField autoComplete="title" name="title" variant="outlined" id="title" label="title" value={title} onChange={onChangeTitle} required fullWidth autoFocus />
            <TextField
              autoComplete="description"
              name="description"
              variant="outlined"
              id="description"
              label="description"
              value={description}
              onChange={onChangeDescription}
              required
              fullWidth
            />
            <TextField autoComplete="body" name="body" variant="outlined" id="body" label="body" value={body} onChange={onChangeBody} required fullWidth />

            <textarea name="body" id="body" placeholder={'body *'} rows={3} value={body} onChange={onChangeBody} style={{marginBottom: '10px'}} required />

            <Box style={{display: 'flex'}}>
              <TextField autoComplete="tag" name="tag" variant="outlined" id="tag" label="tag" value={tags} onChange={onChangeTag} fullWidth />
              <Button onClick={addTagList} variant="outlined" color="secondary" style={{padding: 0, height: '56px'}}>
                추가
              </Button>
            </Box>
            <Box style={{margin: '0 0 30px'}}>
              <SetTagList data={tagsList} />
            </Box>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={'button'}>
            {routerName === '/articles/update' ? '수정' : '생성'}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default ArticlesCreateUpdate;
