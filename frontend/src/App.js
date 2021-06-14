import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import HotelListScreen from './screens/HotelListScreen';
import HotelScreen from './screens/HotelScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ClientScreen from './screens/ClientScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import HotelListAdminScreen from './screens/HotelListAdminScreen';
import OrderListScreen from './screens/OrderListScreen';
import HotelEditScreen from './screens/HotelEditScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route exact path='/' component={HomeScreen} />
          <Route exact path='/hotels' component={HotelListScreen} />
          <Route exact path='/hotels/page/:pageNumber' component={HotelListScreen} />
          <Route path='/hotels/:id' component={HotelScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/shipping' component={ClientScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/place-order' component={PlaceOrderScreen} />
          <Route path='/orders/:id' component={OrderScreen} />
          <Route path='/admin/users' component={UserListScreen} />
          <Route path='/admin/users/:id/edit' component={UserEditScreen} />
          <Route exact path='/admin/hotels' component={HotelListAdminScreen} />
          <Route exact path='/admin/hotels/page/:pageNumber' component={HotelListAdminScreen} />
          <Route exact path='/admin/hotels/:id/edit' component={HotelEditScreen} />
          <Route path='/admin/orders' component={OrderListScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;