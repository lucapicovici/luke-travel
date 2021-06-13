import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Form, Row } from 'react-bootstrap';
import Meta from '../components/Meta';

const HomeScreen = () => {
  return (
    <div>
      <Meta />
      <Link to={'/hotels'}>See all hotels</Link>

      <h2>Search destinations</h2>
    </div>
  )
}

export default HomeScreen
