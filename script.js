mapboxgl.accessToken = 'pk.eyJ1Ijoib21paTEyMyIsImEiOiJjbWg5cjJiZXowcDhpMmtwdmU4N2I4Z3NqIn0.OLgjMvZXtL4emMs9Uzo6zw';

const SF_GEOJSON_URL =
  'https://raw.githubusercontent.com/emilyma214-alt/geogc183-lab9-emilyma/refs/heads/main/data/sf.geojson';

const BERKELEY_GEOJSON_URL =
  'https://raw.githubusercontent.com/emilyma214-alt/geogc183-lab9-emilyma/refs/heads/main/data/correct_geocodeLab9.geojson';

let currentCity = 'berkeley';

const SF_RAINBOW_COLOR = [
  'interpolate',
  ['linear'],
  // take the first 4 chars of "original_date built" -> "1782", "1909", "1860", etc.
  ['to-number', ['slice', ['get', 'original_date built'], 0, 4]],
  1750, 'hsl(0, 100%, 50%)',    // older → red
  1850, 'hsl(120, 100%, 50%)',  // mid → green
  1950, 'hsl(240, 100%, 50%)',  // newer → blue
  2000, 'hsl(300, 100%, 50%)'   // very recent → purple
];

const map = new mapboxgl.Map({
  container: 'map',
  center: [-122.2727, 37.8715], // Berkeley
  style: 'mapbox://styles/omii123/cmh9rfzbh00bl01sq2ktreulg',
  zoom: 12
});

map.on('load', () => {
  const button = document.getElementById('toggle-map');
  const title = document.querySelector('h1');

  // 1. One source for both cities
  map.addSource('points-data', {
    type: 'geojson',
    data: BERKELEY_GEOJSON_URL
  });

  // 2. One layer for both cities
  map.addLayer({
    id: 'points-layer',
    type: 'circle',
    source: 'points-data',
    paint: {
      'circle-color': '#4264FB',       // Berkeley blue
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  // 3. Popups – switch template based on currentCity
  map.on('click', 'points-layer', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const properties = e.features[0].properties;
    let popupContent = '';

    if (currentCity === 'berkeley') {
      popupContent = `
        <div>
          <h3>${properties['original_*Landmark*'] || ''}</h3>
          <p><strong>Address:</strong> ${
            properties['original_*Full Address*'] ||
            properties['original_*Address*'] ||
            ''
          }</p>
          <p><strong>Architect & Date:</strong> ${
            properties['original_*Architect & Date*'] || ''
          }</p>
          <p><strong>Designated:</strong> ${
            properties['original_*  Designated  *'] || ''
          }</p>
          ${
            properties['original_*Notes*']
              ? `<p><strong>Notes:</strong> ${properties['original_*Notes*']}</p>`
              : ''
          }
        </div>
      `;
    } else if (currentCity === 'sf') {
      popupContent = `
        <div>
          <h3>${properties['original_Building Name'] || ''}</h3>
          <p><strong>Address:</strong> ${properties['original_Full Address'] || ''}</p>
          <p><strong>Date Built:</strong> ${properties['original_date built'] || ''}</p>
          <p><strong>Date Designated:</strong> ${
            properties['original_date designated'] || ''
          }</p>
        </div>
      `;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Cursor change
  map.on('mouseenter', 'points-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'points-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  // 4. Toggle between Berkeley and SF
  button.addEventListener('click', () => {
    if (currentCity === 'berkeley') {
      // Switch to SF
      currentCity = 'sf';

      map.getSource('points-data').setData(SF_GEOJSON_URL);
      map.setPaintProperty('points-layer', 'circle-color', SF_RAINBOW_COLOR);

      map.flyTo({
        center: [-122.4194, 37.7749],
        zoom: 12
      });

      title.textContent = 'Heritage Map of San Francisco';
      title.classList.add('sf-font');
      button.textContent = 'Show Berkeley Heritage Map';
    } else {
      // Switch back to Berkeley
      currentCity = 'berkeley';

      map.getSource('points-data').setData(BERKELEY_GEOJSON_URL);
      map.setPaintProperty('points-layer', 'circle-color', '#4264FB');

      map.flyTo({
        center: [-122.2727, 37.8715],
        zoom: 12
      });

      title.textContent = 'Heritage Map of Berkeley';
      title.classList.remove('sf-font');
      button.textContent = 'Show SF Heritage Map';
    }
  });
});
