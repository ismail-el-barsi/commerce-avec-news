import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import SearchBox from './components/SearchBox';
import logo from './logo/logo.png';
import CreateProductPage from './screens/CreateProductPage.js';
import HomeScreen from './screens/HomeScreen.js';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SearchScreen from './screens/SearchScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserListScreen from './screens/UserListScreen';
import { Store } from './Store';
import { getError } from './utils';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg='dark' variant='dark' expand='lg'>
            <Container>
              <Button
                variant='dark'
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className='fas fa-bars'></i>
              </Button>
              <LinkContainer to='/'>
                <Navbar.Brand>
                  <img
                    src={logo}
                    alt='Commerce'
                    style={{ width: '40px', marginRight: '10px' }}
                  />
                  Commerce
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox />
                <Nav className='me-auto w-100 justify-content-end'>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.username}
                      id='basic-nav-dropdown'
                    >
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>
                          Profil de l'utilisateur
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className='dropdown-item'
                        to='#signout'
                        onClick={signoutHandler}
                      >
                        Se déconnecter
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className='nav-link' to='/signin'>
                      <Button
                        variant='outline-light'
                        className='d-flex align-items-center'
                      >
                        <FaSignInAlt className='me-2' />
                        Se connecter
                      </Button>
                    </Link>
                  )}
                  {userInfo && (
                    <NavDropdown title='Menu' id='admin-nav-dropdown'>
                      <LinkContainer to='/admin/products'>
                        <NavDropdown.Item>Produits</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/users'>
                        <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className='flex-column text-white w-100 p-2'>
            <Nav.Item>
              <strong>Catégories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path='/product/:slug' element={<ProductScreen />} />
              <Route path='/' element={<HomeScreen />} />
              <Route path='/search' element={<SearchScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/admin/product/'
                element={<CreateProductPage />}
              ></Route>
              <Route path='/signup' element={<SignupScreen />} />

              <Route path='/admin/products' element={<ProductListScreen />} />
              <Route
                path='/admin/product/:id'
                element={<ProductEditScreen />}
              />

              <Route path='/admin/users' element={<UserListScreen />} />
              <Route
                path='/admin/user/:id'
                element={<UserEditScreen />}
              ></Route>
            </Routes>
          </Container>
        </main>
        <footer className='bg-dark text-white mt-4'>
          <Container className='py-4'>
            <div className='row'></div>
            <div className='text-center mt-3'>
              &copy; {new Date().getFullYear()} Commerce. Tous droits réservés.
            </div>
          </Container>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
