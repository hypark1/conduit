import React, {useCallback, useEffect, useContext} from 'react';
import {Box, Chip, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import SetDate from '@modules/SetDate';
import SetTagList from '@modules/SetTagList';
import ArticlesContext from '../../component/articles/context';

/*아티클 그리드*/
const ArticlesFeed = () => {
  const {fetching, list, goArticleView, clickFavorite, setInfinitePage} = useContext(ArticlesContext);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
  });

  /*스크롤*/
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if(scrollTop + clientHeight >= scrollHeight && fetching === false) {
      setInfinitePage();
    }
  }

  /*리스트 dom*/
  const setListDom = useCallback(() => {
    let dom = list.map((value, index) => (
      <>
      <Box className={'articleFeedBox'}>
        <Box>
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
            <Box className={'articleFeedWrap'}>
              {setListDom()}
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

export default (ArticlesFeed);
