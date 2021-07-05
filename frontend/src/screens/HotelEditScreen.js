import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep.js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import { listHotelDetails, updateHotel } from '../store/actions/hotelActions';
import { HOTEL_UPDATE_RESET } from '../store/constants/hotelConstants';

const HotelEditScreen = ({ match, history }) => {
  const hotelId = match.params.id;  

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [rooms, setRooms] = useState([]);

  const hotelDetails = useSelector(state => state.hotelDetails);
  const { loading, error, hotel } = hotelDetails;

  const hotelUpdate = useSelector(state => state.hotelUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = hotelUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: HOTEL_UPDATE_RESET });
      history.push('/admin/hotels');
    } else {
      if (hotel._id !== hotelId && !loading) {
        dispatch(listHotelDetails(hotelId));
      } else {
        setName(hotel.name);
        setType(hotel.type);
        setLocation(hotel.location?.formattedAddress);
        setImages(hotel.images);
        setRooms(hotel.roomTypes);
      }
    }
  }, [dispatch, hotel, hotelId, loading, history, successUpdate]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(updateHotel({
      ...hotel,
      name,
      type,
      images,
      address: location,
      roomTypes: rooms
    }));
  };

  const handleImagesChange = val => {
    if (!val) {
      setImages([]);
    } else {
      let copiedImages = val.split(',');
  
      copiedImages = copiedImages.map(el => {
        return { src: el }
      });
  
      setImages(copiedImages);
    }
  }

  const handleRoomsChange = (roomId, key, val) => {
    let copiedRooms = cloneDeep(rooms);

    switch(key) {
      case 'facilities':
        copiedRooms[roomId]['facilities'] = val.split(',');
        break;
      case 'images':
        if (!val) {
          copiedRooms[roomId]['images'] = [];
        } else {
          let copiedImages = val.split(',');
    
          copiedImages = copiedImages.map(el => {
            return { src: el }
          });
  
          copiedRooms[roomId][`${key}`] = copiedImages;
        }
        break;
      default:
        copiedRooms[roomId][`${key}`] = val;
        break;
    }
    setRooms(copiedRooms);
  };

  const handleImagesValue = imagesArr => {
    return imagesArr.map(el => el.src).join();
  };

  return (
    <>
      <Meta title={`Edit ${hotel.name}`} />
      <Link to='/admin/hotels' className='btn btn-light my-3'>
        Go Back
      </Link>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
          <FormContainer>
            <h3>Edit Hotel</h3>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter hotel name'
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='type'>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter hotel type'
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='location'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter hotel location'
                  value={location}
                  required
                  onChange={(e) => setLocation(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter hotel image link'
                  value={images && handleImagesValue(images)}
                  name='images'
                  onChange={(e) => handleImagesChange(e.target.value)}
                ></Form.Control>
                <Form.Text>Enter each image link like this: a,b,c</Form.Text>
              </Form.Group>

              {rooms && hotel.roomTypes?.map((room, id) => (
                <>
                <hr/>
                <h5>{room.name}</h5>
                <br/>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter room name'
                    value={rooms[id]?.['name']}
                    name='name'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Beds</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter room beds info'
                    value={rooms[id]?.['beds']}
                    name='beds'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Adults</Form.Label>
                  <Form.Control
                    type='number'
                    min='1'
                    placeholder='Enter room adults count'
                    value={rooms[id]?.['peopleCount']}
                    name='peopleCount'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Available Rooms</Form.Label>
                  <Form.Control
                    type='number'
                    min='1'
                    placeholder='Enter available rooms for this room type'
                    value={rooms[id]?.['availableRooms']}
                    name='availableRooms'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Facilities</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter room facilities'
                    value={rooms[id]?.['facilities']}
                    name='facilities'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                  <Form.Text>Enter each facility like this: a,b,c</Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Price Per Night ($)</Form.Label>
                  <Form.Control
                    type='number'
                    min='0'
                    placeholder='Enter room price'
                    value={rooms[id]?.['price']}
                    name='price'
                    required
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Images</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter room images links'
                    value={rooms[id]?.['images'] && handleImagesValue(rooms[id]['images'])}
                    name='images'
                    onChange={(e) => handleRoomsChange(id, e.target.name, e.target.value)}
                  ></Form.Control>
                  <Form.Text>Enter each image link like this: a,b,c</Form.Text>
                </Form.Group>
                </>
              ))}

              <Button type='submit' variant='primary'>
                Update
              </Button>
            </Form>
          </FormContainer>
      )}
    </>
  )
}

export default HotelEditScreen;