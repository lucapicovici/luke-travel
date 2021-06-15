import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout } from '../store/actions/userActions.js';
import { CART_RESET } from '../store/constants/cartConstants';
import { useHistory } from 'react-router';

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector(state => state.cart);
  const { booking } = cart;
  const bookingExists = Object.keys(booking).length !== 0;

  const logoutHandler = () => {
    dispatch(logout());
  }

  const clearBookingHandler = () => {
    dispatch({ type: CART_RESET });
    localStorage.removeItem('booking');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    history.push('/');
  }

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand id='navbar-brand'>Luke Travel</Navbar.Brand>        
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            {bookingExists && (
              <NavDropdown title={`Currently booking: ${booking.room.name}`} id='booking'>
                <LinkContainer to={`/hotels/${booking.hotel._id}?room=${booking.room._id}`}>
                  <NavDropdown.Item>View room</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/login?redirect=shipping'>
                  <NavDropdown.Item>Proceed To Checkout</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={clearBookingHandler}>
                  Clear Booking
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {userInfo ? (
              <NavDropdown title={userInfo.name} id='username'>
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link><i className='fas fa-user'></i> Sign In</Nav.Link>
              </LinkContainer>
            )}
            {userInfo?.isAdmin && (
              <NavDropdown title='Admin' id='adminMenu'>
                <LinkContainer to='/admin/users'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/hotels'>
                  <NavDropdown.Item>Hotels</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/orders'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header;