import React, {useCallback, useContext} from 'react';
import {Box, Chip, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Pagination from '@material-ui/lab/Pagination';
import SetDate from '@modules/SetDate';
import SetTagList from '@modules/SetTagList';
import ArticlesContext from '../../component/articles/context';

/*리스트*/
const ArticlesList = () => {
  const {count, page, list, handlePageChange, goArticleView, clickFavorite} = useContext(ArticlesContext);

  /*리스트 dom*/
  const setListDom = useCallback(() => {
    let dom = list.map((value, index) => (
      <>
        <Box className={'articleListBox'} key={index}>
          <Typography variant={'h5'} className={'listTitle'} onClick={() => goArticleView(value.slug)}>
            {value.title}
          </Typography>
          <Typography variant={'subtitle2'} className={'description'}>
            {value.description}
          </Typography>
          <Box className={'user'}>
            <img src={value.author.image} alt={'username'} className={'profileImg'} />
            <Typography variant="body2" className={'userText'}>
              {value.author.username}
            </Typography>
            <Typography variant={'body2'} className={'description'}>
              {SetDate(value.createdAt)}
            </Typography>
          </Box>
          <Box style={{margin: '20px 0 0'}}>
            <SetTagList data={value.tagList} />
          </Box>
          <Box className={'listChip'}>
          {
            value.favorited?
            <Chip avatar={<Avatar>♥</Avatar>} label={value.favoritesCount} clickable color="primary" onClick={() => clickFavorite('DELETE', value.slug, index)} />
            :
            <Chip avatar={<Avatar>♥</Avatar>} label={value.favoritesCount} clickable color="primary" onClick={() => clickFavorite('POST', value.slug, index)} variant='outlined' />
          }
            </Box>
        </Box>
      </>
    ))
    return dom;
  }, [list])

  return (
    <>
      {list ? (
        list.length > 0 ? (
          <>
            {setListDom()}
            <Box>
              <Pagination count={count} page={page + 1} onChange={handlePageChange} size="large" />
            </Box>
          </>
        ) : (
          <>
            <Box className={'centerBox'}>
              <Typography>리스트가 없습니다.</Typography>
            </Box>
          </>
        )
      ) : (
        <>
          <Box className={'centerBox'}>
            <Typography>리스트 로딩중...</Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default (ArticlesList);
