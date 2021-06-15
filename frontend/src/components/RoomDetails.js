import React from 'react';
import { ListGroup } from 'react-bootstrap';

const RoomDetails = ({ room }) => {
  return (
    <ListGroup className='roomDetails'>
      <ListGroup.Item key='name'>
        Name: <strong>{room.name}</strong>
      </ListGroup.Item>
      <ListGroup.Item key='beds'>
        Beds: <strong>{room.beds}</strong>
      </ListGroup.Item>
      <ListGroup.Item key='peopleCount'>
        Suitable for: <strong>{room.peopleCount}</strong>
      </ListGroup.Item>
      <ListGroup.Item key='availableRooms'>
        Available rooms: <strong>{room.availableRooms}</strong>
      </ListGroup.Item>
      <ListGroup.Item className='bg-light' key='facilities'>
        Facilities
      </ListGroup.Item>
      {room.facilities?.map((f, idx) => (
        <ListGroup.Item key={idx}>
          - {f}
        </ListGroup.Item>
      ))}
      <ListGroup.Item key='price'>
        Price: <strong>${room.price}/night</strong>
      </ListGroup.Item>
    </ListGroup>
  )
}

export default RoomDetails
