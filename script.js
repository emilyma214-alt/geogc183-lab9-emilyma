mapboxgl.accessToken = 'pk.eyJ1Ijoib21paTEyMyIsImEiOiJjbWg5cjJiZXowcDhpMmtwdmU4N2I4Z3NqIn0.OLgjMvZXtL4emMs9Uzo6zw';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: [-122.2727, 37.8715], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  style: 'mapbox://styles/omii123/cmh9rfzbh00bl01sq2ktreulg',
  zoom: 12 // starting zoom
    });
