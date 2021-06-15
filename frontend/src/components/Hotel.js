import React from 'react';
import Rating from '../components/Rating';
import { Link } from 'react-router-dom';

const Hotel = ({ hotel }) => {
  return (
    <div className="card mb-3 hotelListCard">
      <div className="row no-gutters">
        <Link className="col-md-4 imgWrapper" to={`/hotels/${hotel._id}`}>
          <img src={hotel.images?.[0]?.src || ''} alt={hotel.name} />
        </Link>
        <div className="col-md-8">
          <div className="card-body">
            <div className="card-title-wrap">
              <Link className="card-title" to={`/hotels/${hotel._id}`}>
                <span>{hotel.name}</span>
              </Link>
              <Rating
                value={hotel.rating} 
                text={` ${hotel.numReviews} reviews`}
              />
            </div>
            <p className="card-text type">{hotel.type}</p>
            <p className="card-text description">{hotel.description}</p>
            <p className="card-text address"><small className="text-muted">{hotel.location?.formattedAddress}</small></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hotel
