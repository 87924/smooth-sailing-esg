
import mapboxgl from 'mapbox-gl';

// Fly to specific coordinates
export const flyToCoordinates = (
  map: mapboxgl.Map, 
  coords: [number, number], 
  zoom: number = 10, 
  pitch: number = 60, 
  duration: number = 2000
) => {
  if (!map || !map.loaded()) return;
  
  map.flyTo({
    center: coords,
    zoom: zoom,
    pitch: pitch,
    bearing: 0,
    duration: duration,
    essential: true
  });
};

// Oil contamination specific helper
export const focusOnOilContamination = (map: mapboxgl.Map) => {
  // These coordinates are for the Bay of Honduras, particularly the area with 
  // higher concentration of oil contamination detected
  const coordinates: [number, number] = [-87.6225, 15.9752];
  flyToCoordinates(map, coordinates, 12, 45, 2500);
};

// Track oil spill contamination data
export const trackOilSpillDataPoints = (
  map: mapboxgl.Map,
  dataPoints: {lat: number, lng: number, severity: number}[]
) => {
  if (!map || !map.loaded() || !dataPoints.length) return;
  
  try {
    // Remove existing oil spill layer if it exists
    if (map.getSource('oil-spill-data')) {
      if (map.getLayer('oil-spill-layer')) {
        map.removeLayer('oil-spill-layer');
      }
      map.removeSource('oil-spill-data');
    }
    
    // Add oil spill data as a source
    map.addSource('oil-spill-data', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: dataPoints.map(point => ({
          type: 'Feature',
          properties: {
            severity: point.severity
          },
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          }
        }))
      }
    });
    
    // Add the oil spill layer
    map.addLayer({
      id: 'oil-spill-layer',
      type: 'circle',
      source: 'oil-spill-data',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'severity'],
          1, 5,
          5, 20
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'severity'],
          1, 'rgba(255, 255, 0, 0.5)',  // Yellow for low severity
          3, 'rgba(255, 165, 0, 0.6)',  // Orange for medium
          5, 'rgba(255, 0, 0, 0.7)'     // Red for high
        ],
        'circle-blur': 0.4,
        'circle-opacity': 0.8
      }
    });
  } catch (error) {
    console.error("Error tracking oil spill data:", error);
  }
};
