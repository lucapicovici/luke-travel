import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Form, Row } from 'react-bootstrap';
import {
  getCurrentDay,
  getNextDay
} from '../utils/dates';

const HomeScreen = () => {
  return (
    <div>
      <Link to={'/hotels'}>See all hotels</Link>

      <h2>Search destinations</h2>
    </div>
  )
}

export default HomeScreen
