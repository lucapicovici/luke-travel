import React from 'react'
import { ListGroup } from 'react-bootstrap'

const RoomDetails = ({ room }) => {
  return (
    <ListGroup className='roomDetails'>
      <ListGroup.Item>
        Name: <strong>{room.name}</strong>
      </ListGroup.Item>
      <ListGroup.Item>
        Beds: <strong>{room.beds}</strong>
      </ListGroup.Item>
      <ListGroup.Item>
        Suitable for: <strong>{room.peopleCount}</strong>
      </ListGroup.Item>
      <ListGroup.Item>
        Available rooms: <strong>{room.availableRooms}</strong>
      </ListGroup.Item>
      <ListGroup.Item className='bg-light'>
        Facilities
      </ListGroup.Item>
      {room.facilities && room.facilities.map(f => (
        <ListGroup.Item>
          - {f}
        </ListGroup.Item>
      ))}
      <ListGroup.Item>
        Price: <strong>${room.price}/night</strong>
      </ListGroup.Item>
    </ListGroup>
  )
}

export default RoomDetails
