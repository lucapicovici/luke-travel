import React from 'react';
import { Helmet } from 'react-helmet';

const Map = ({ lat, lng, text, subtext }) => {
  return (
    <Helmet>
      <script type="text/javascript" lat={lat} lng={lng} text={text} subtext={subtext}>
        {`
          const lat = document.currentScript.getAttribute('lat');
          const lng = document.currentScript.getAttribute('lng');
          const text = document.currentScript.getAttribute('text');
          const subtext = document.currentScript.getAttribute('subtext');
          window.onload = function() {
            L.mapquest.key = 'Dhql5s1ieeMg8y87RXgqvZeQeeo0QFUE';

            var map = L.mapquest.map('map', {
              center: [lat, lng],
              layers: L.mapquest.tileLayer('map'),
              zoom: 15
            });

            L.mapquest.textMarker([lat, lng], {
              text: text,
              subtext: subtext,
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
        `}
      </script>
    </Helmet>
  )
}

export default Map
