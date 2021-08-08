import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {Button, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import API from '@modules/API';
import SetDate from '@modules/SetDate';
import ErrorSet from '@modules/ErrorSet';

/*댓글영역*/
const Comments = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState('');
  const isLogin = useSelector((store) => store.isLogin);
  const user = useSelector((store) => store.user);
  const router = useRouter();

  useEffect(() => {
    getCommentsList();
  }, []);

  /*댓글 리스트*/
  const getCommentsList = useCallback(() => {
    API({
      method: 'GET',
      url: '/articles/' + router.query.slug + '/comments'
    })
      .then((response) => {
        if (response.request.status === 200) {
          setData(response.data.comments);
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, [router.query.slug]);

  /*댓글 삭제*/
  const deleteCommentsBtn = useCallback((id) => {
    if (confirm('삭제하겠습니까?')) {
      API({
        method: 'DELETE',
        url: '/articles/' + router.query.slug + '/comments/' + id
      })
        .then((response) => {
          if (response.request.status === 200) {
            alert('삭제가 완료되었습니다.')
            getCommentsList();
          }
        })
        .catch((error) => {
          ErrorSet(error, router);
        });
    }
  }, [router.query.slug]);

  /*댓글 등록*/
  const postCpmmentsCreate = useCallback(() => {
    let data = {
      comment: {
        body: comment
      }
    };
    API({
      method: 'POST',
      data: data,
      url: '/articles/' + router.query.slug + '/comments'
    })
      .then((response) => {
        if (response.request.status === 200) {
          getCommentsList();
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, [comment]);

  /*입력 버튼 클릭*/
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (comment) {
        postCpmmentsCreate();
        setComment('')
      } else {
        alert('댓글을 입력하세요.');
      }
    },
    [comment]
  );

  /*댓글 input*/
  const onChangeComment = useCallback((value) => {
    setComment(value.target.value);
  }, []);

  /*댓글 리스트 dom*/
  const setCommentList = useCallback(() => {
    let dom = <></>;
    let list = data;
    if (list.length > 0) {
      dom = list.map((value) => {
        return (
          <>
            <Box className={'commentList'} key={value.createdAt}>
              <Box className={'user'}>
                <img src={value.author.image} alt={'username'} className={'profileImg'} />
                <Box className={'userText'}>
                  <Typography variant="subtitle2">{value.author.username}</Typography>
                  <Typography variant="subtitle2" className={'description'}>{SetDate(value.createdAt)}</Typography>
                </Box>
              </Box>
              <Box className={'commentBody'}>
                <Typography variant={'body1'}>{value.body}</Typography>
              </Box>
              {
                value.author.username === user.author.username ?
                  <Button onClick={() => deleteCommentsBtn(value.id)} variant="outlined" color="secondary">
                    삭제
                  </Button>
                  :
                  null
              }
            </Box>
          </>
        );
      });
    }
    return dom;
  }, [data, user]);

  return (
    <>
      {setCommentList()}
      <form onSubmit={handleSubmit}>
        <Box className={'commentBox'}>
          <textarea rows="5" placeholder={isLogin ? '댓글을 입력하세요.' : '로그인 하세요.'} value={comment} onChange={onChangeComment} disabled={!isLogin} />
          <Button type="submit" fullWidth variant="contained" color="primary" className={'button'} disabled={!isLogin}>
            입력
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Comments;
