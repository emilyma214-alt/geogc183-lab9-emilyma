mapboxgl.accessToken = 'pk.eyJ1Ijoib21paTEyMyIsImEiOiJjbWg5cjJiZXowcDhpMmtwdmU4N2I4Z3NqIn0.OLgjMvZXtL4emMs9Uzo6zw';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: [-122.2727, 37.8715], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  style: 'mapbox://styles/omii123/cmh9rfzbh00bl01sq2ktreulg',
  zoom: 12 // starting zoom
    });

map.on('load', function() {
  map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/emilyma214-alt/geogc183-lab9-emilyma/refs/heads/main/data/correct_geocodeLab9.geojson'
    });

  map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#4264FB',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });
  
// Add click event for popups
  map.on('click', 'points-layer', (e) => {
        // Copy coordinates array
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        // Create popup content using the actual data properties
        const popupContent = `
            <div>
                <h3>${properties["original_*Landmark*"]}</h3>
                <p><strong>Address:</strong> ${properties["original_*Full Address*"]}</p>
                <p><strong>Architect & Date:</strong> ${properties["original_*Architect & Date*"]}</p>
                <p><strong>Designated:</strong> ${properties["original_*  Designated  *"]}</p>
                ${properties["original_*Notes*"] ? `<p><strong>Notes:</strong> ${properties["original_*Notes*"]}</p>` : ""}
            </div>
        `;
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);

    });
    // Change cursor to pointer when hovering over points
    map.on('mouseenter', 'points-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back when leaving points
    map.on('mouseleave', 'points-layer', () => {
        map.getCanvas().style.cursor = '';
    });
});
