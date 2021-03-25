import React from 'react'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
  return (
    <div>
      <Link to={'/hotels'}>See all hotels</Link>
    </div>
  )
}

export default HomeScreen
