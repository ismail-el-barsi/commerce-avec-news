import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function CreateNewsPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const createNewsHandler = async (e) => {
    e.preventDefault();
    if (window.confirm('Êtes-vous sûr de vouloir créer cette actualité ?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          'http://localhost:3003/news/create',
          {
            title,
            slug,
            content,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Actualité créée avec succès');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/news`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'CREATE_FAIL',
          payload: getError(err),
        });
      }
    }
  };

  return (
    <Container className='small-container'>
      <h1>Créer une nouvelle actualité</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={createNewsHandler}>
          <Form.Group className='mb-3' controlId='title'>
            <Form.Label>Titre</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='slug'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='content'>
            <Form.Label>Contenu</Form.Label>
            <Form.Control
              as='textarea'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
          </Form.Group>
          <div className='mb-3'>
            <Button type='submit'>Créer</Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
