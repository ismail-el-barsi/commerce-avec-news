import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import NewsCard from '../components/NewsCard';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, news: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function NewsListScreen() {
  const [{ loading, error, news }, dispatch] = useReducer(reducer, {
    news: [],
    loading: true,
    error: '',
  });

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
      <h1>Actualités</h1>
      <div className='news-list'>
        {loading ? (
          <LoadingBox />
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
