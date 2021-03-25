import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import HotelListScreen from './screens/HotelListScreen';
import HotelScreen from './screens/HotelScreen';
import LoginScreen from './screens/LoginScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route exact path='/' component={HomeScreen} />
          <Route path='/hotels' component={HotelListScreen} />
          <Route path='/hotel/:id' component={HotelScreen} />
          <Route path='/login' component={LoginScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
