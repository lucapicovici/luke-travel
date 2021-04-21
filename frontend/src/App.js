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
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route exact path='/' component={HomeScreen} />
          <Route exact path='/hotels' component={HotelListScreen} />
          <Route exact path='/hotels/page/:pageNumber' component={HotelListScreen} />
          <Route path='/hotel/:id' component={HotelScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/place-order' component={PlaceOrderScreen} />
          <Route path='/order/:id' component={OrderScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
