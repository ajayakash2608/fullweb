import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice'; // Ensure this is correctly set up
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const [logoutApiCall] = useLogoutMutation(); // Ensure this hook correctly handles the API call
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      // Call the logout API and unwrap the response to get the result or throw an error
      await logoutApiCall().unwrap();
      // Dispatch the logout action
      dispatch(logout());
      // Navigate to the login page after successful logout
      navigate('/login');
      // Show success toast message
      toast.success('Logout successful');
    } catch (error) {
      // Show error toast message
      toast.error(error?.data?.message || error.error || 'Logout failed');
    }
  };

  return (
    <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect className='fixed-top z-2'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>EquRent Shop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto m-2'>
            <SearchBox />
            <LinkContainer to='/cart'>
              <Nav.Link>
                <FaShoppingCart style={{ marginRight: '5px' }} />
                Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='warning' style={{ marginLeft: '5px' }} className='text-dark'>
                    <strong>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</strong>
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            {userInfo ? (
              <NavDropdown title={`Hello👋, ${userInfo.name}`} id='username'>
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link>
                  <FaUser style={{ marginRight: '5px' }} />
                  Sign In
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
