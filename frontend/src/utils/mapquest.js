const initMapQuestMap = async(latitude, longitutde, hotelName, hotelType) => {
  var L = window.L;

  L.mapquest.key = 'Dhql5s1ieeMg8y87RXgqvZeQeeo0QFUE';

  var map = L.mapquest.map('map', {
    center: [latitude, longitutde],
    layers: L.mapquest.tileLayer('map'),
    zoom: 17
  });

  L.mapquest.textMarker([latitude, longitutde], {
    text: hotelName,
    subtext: hotelType,
    position: 'right',
    type: 'marker',
    icon: {
      primaryColor: '#333333',
      secondaryColor: '#333333',
      size: 'sm'
    }
  })
  .addTo(map);

  map.addControl(L.mapquest.control());
}

export default initMapQuestMap;