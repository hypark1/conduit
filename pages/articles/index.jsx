import React, {useCallback, useState, useEffect} from 'react';
import {useRouter} from 'next/dist/client/router';
import {Button, Container, Paper, Tab, Tabs} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ErrorSet from '@modules/ErrorSet';
import API from '@modules/API';
import Header from '@component/header';
import ArticlesList from '@component/articles/list';
import ArticlesFeed from '@component/articles/feed';
import ArticlesContext from '../../component/articles/context';

const TabPanel = (props) => {
  const {children, value, index, ...other} = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} aria-labelledby={`scrollable-auto-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
};

const Articles = () => {
  const [value, setValue] = useState(0);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(1);
  const [fetching, setFetching] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth < 750) {
      setRowsPerPage(10);
    }
    GetArticlesList();
  }, [page, value]);

  const GetArticlesList = useCallback(() => {
    setFetching(true);
    if (page <= count) {
      let data = {
        limit: rowsPerPage,
        offset: page
      };
      API({
        method: 'GET',
        params: data,
        url: '/articles'
      })
      .then((response) => {
        setFetching(false);
        if (response.request.status === 200) {
          let feedList;
          if (value === 0) {
            /*리스트*/
            setList(response.data.articles);
          } else {
            /*그리드*/
            if (list) {
              feedList = list.concat(response.data.articles);
            } else {
              feedList = response.data.articles;
            }
            setList(feedList);
          }
          setCount(Math.ceil(response.data.articlesCount / rowsPerPage));
        }
      })
      .catch((error) => {
        setFetching(false);
        ErrorSet(error, router);
      });
    }
  }, [page, value, rowsPerPage, count]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value - 1);
  }, []);

  const setInfinitePage = useCallback(() => {
    setPage(page + 1);
  }, [page])

  const goArticleView = useCallback((value) => {
    router.push({
      pathname: '/articles/view',
      query: {slug: value}
    });
  }, []);

  /*즐겨찾기 버튼 클릭*/
  const clickFavorite = useCallback((method, slug, index) => {
    let listTmp = [...list];
    listTmp[index].favorited = !listTmp[index].favorited;
    if (method === 'POST') {
      listTmp[index].favoritesCount++;
    } else {
      listTmp[index].favoritesCount--;
    }
    setList(listTmp);
    API({
      method: method,
      url: '/articles/' + slug + '/favorite'
    })
      .then((response) => {
        if (response.request.status === 200) {
          //완료
        }
      })
      .catch((error) => {
        ErrorSet(error, router);
      });
  }, [list]);

  /*리스트, 그리드 탭 클릭*/
  const handleTapChange = useCallback((event, newValue) => {
    setList(null);
    setPage(0);
    setValue(newValue);
  }, []);

  const createArticleBtn = useCallback(() => {
    router.push('/articles/create');
  }, []);

  return (
    <>
      <Header />
      <Paper className={'tapBox'}>
        <Tabs value={value} onChange={handleTapChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="리스트" {...a11yProps(0)} />
          <Tab label="그리드" {...a11yProps(1)} />
        </Tabs>
      </Paper>
      <Container component="main" maxWidth="lg">
        <Box style={{textAlign: 'right', marginTop: '20px'}}>
          <Button variant="contained" color="primary" onClick={() => createArticleBtn()}>
            생성하기
          </Button>
        </Box>
        <ArticlesContext.Provider value={{ fetching: fetching, count: count, page: page, list: list, handlePageChange: handlePageChange, goArticleView: goArticleView, clickFavorite: clickFavorite, setInfinitePage: setInfinitePage }}>
          <TabPanel value={value} index={0}>
            <ArticlesList count={count} page={page} list={list} handlePageChange={handlePageChange} goArticleView={goArticleView} clickFavorite={clickFavorite}  />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ArticlesFeed count={count} page={page} list={list} handlePageChange={handlePageChange} goArticleView={goArticleView} clickFavorite={clickFavorite}  />
          </TabPanel>
        </ArticlesContext.Provider>
        {/*{setListDom()}*/}
      </Container>
    </>
  );
};

export default Articles;
