import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import NewsCard from '../components/NewsCard';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, maintenance: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        news: action.payload,
        loading: false,
        maintenance: false,
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
        maintenance: true,
      };
    default:
      return state;
  }
};

function NewsListScreen() {
  const [{ loading, error, news, maintenance }, dispatch] = useReducer(
    reducer,
    {
      news: [],
      loading: true,
      error: '',
      maintenance: false,
    }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('http://localhost:3003/news');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {!maintenance && <h1>Actualités</h1>}
      <div className='news-list'>
        {loading ? (
          <LoadingBox />
        ) : maintenance ? (
          <div className='text-center'>
            <h3>Site en maintenance</h3>
            <Spinner animation='border' role='status' variant='warning'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
            <p className='mt-3'>
              Nous travaillons à résoudre le problème. Merci de votre patience !
            </p>
          </div>
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : news.length === 0 ? (
          <MessageBox variant='info'>
            Aucune actualité disponible pour le moment.
          </MessageBox>
        ) : (
          <>
            <Row>
              {currentNews.map((item) => (
                <Col key={item._id} sm={6} md={4} lg={3} className='mb-3'>
                  <NewsCard news={item}></NewsCard>
                </Col>
              ))}
            </Row>
            <Pagination>
              {[...Array(totalPages).keys()].map((x) => (
                <Pagination.Item
                  key={x + 1}
                  active={x + 1 === currentPage}
                  onClick={() => handlePageChange(x + 1)}
                >
                  {x + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}

export default NewsListScreen;
