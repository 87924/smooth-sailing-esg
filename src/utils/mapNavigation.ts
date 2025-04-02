
import mapboxgl from 'mapbox-gl';
import { toast } from "@/components/ui/use-toast";

// Function to fly to specific coordinates
export const flyToCoordinates = (map: mapboxgl.Map, coords: [number, number], zoom: number = 12) => {
  if (!map || !map.loaded()) return;
  
  map.flyTo({
    center: coords,
    zoom: zoom,
    speed: 0.8,
    curve: 1.5,
    essential: true
  });
  
  // Add a marker at the target coordinates
  const marker = new mapboxgl.Marker({ color: '#0FA0CE' })
    .setLngLat(coords)
    .addTo(map);
  
  // Remove the marker after a few seconds
  setTimeout(() => marker.remove(), 5000);
};

// Function to create 3D terrain effect (when using Mapbox GL)
export const add3DTerrain = (map: mapboxgl.Map) => {
  if (!map || !map.loaded()) return;
  
  try {
    // Add source for terrain
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    
    // Add terrain and sky layers
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    
    // Add sky layer for more realistic environment
    map.addLayer({
      'id': 'sky',
      'type': 'sky',
      'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
      }
    });
    
    toast({
      title: "3D Terrain Enabled",
      description: "Map now shows elevation data",
    });
  } catch (error) {
    console.error("Error adding 3D terrain:", error);
  }
};

// Function to disable 3D terrain
export const disable3DTerrain = (map: mapboxgl.Map) => {
  if (!map || !map.loaded()) return;
  
  try {
    map.setTerrain(null);
    if (map.getLayer('sky')) {
      map.removeLayer('sky');
    }
    if (map.getSource('mapbox-dem')) {
      map.removeSource('mapbox-dem');
    }
  } catch (error) {
    console.error("Error disabling 3D terrain:", error);
  }
};

// Function to handle marker clustering
export const setupMarkerClustering = (map: mapboxgl.Map, data: any[], clusterRadius: number = 50) => {
  if (!map || !map.loaded() || !data.length) return;
  
  try {
    // If source already exists, remove it
    if (map.getSource('waste-points')) {
      if (map.getLayer('clusters')) {
        map.removeLayer('clusters');
      }
      if (map.getLayer('cluster-count')) {
        map.removeLayer('cluster-count');
      }
      if (map.getLayer('unclustered-point')) {
        map.removeLayer('unclustered-point');
      }
      map.removeSource('waste-points');
    }
    
    // Convert data to GeoJSON
    const geojsonData = {
      type: 'FeatureCollection',
      features: data.map(item => ({
        type: 'Feature',
        properties: {
          type: item.type,
          severity: item.severity,
          size: item.size
        },
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat]
        }
      }))
    };
    
    // Add a new source for the clusters
    map.addSource('waste-points', {
      type: 'geojson',
      data: geojsonData as any,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: clusterRadius // Radius of each cluster when clustering points
    });
    
    // Add cluster circles layer
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'waste-points',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#0FA0CE', // Small clusters
          20,
          '#00CFCC', // Medium clusters
          50,
          '#F2B705'  // Large clusters
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, // Size for small clusters
          20,
          30, // Size for medium clusters
          50,
          40  // Size for large clusters
        ],
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.5
      }
    });
    
    // Add cluster count text layer
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'waste-points',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    });
    
    // Add layer for unclustered points
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'waste-points',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'severity'],
          'high', '#F15152',
          'medium', '#F2B705',
          'low', '#0FA0CE',
          '#0FA0CE' // Default color
        ],
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.5
      }
    });
    
    // Add click event for clusters
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      
      // Get the cluster expansion zoom
      map.getSource('waste-points').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;
          
          // Zoom to the cluster
          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom
          });
        }
      );
    });
    
    // Add mouse events for better interaction
    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
    
    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });
    
    // Add click event for unclustered points
    map.on('click', 'unclustered-point', (e) => {
      const coordinates = (e.features[0].geometry as any).coordinates.slice();
      const properties = e.features[0].properties;
      
      // Create popup content based on properties
      const content = `
        <div class="popup-content">
          <h3>${properties.type.replace('_', ' ')}</h3>
          <p>Severity: ${properties.severity}</p>
          <p>Size: ${properties.size} tons</p>
        </div>
      `;
      
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(map);
    });
    
    // Return a cleanup function
    return () => {
      if (map.getLayer('clusters')) map.removeLayer('clusters');
      if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
      if (map.getLayer('unclustered-point')) map.removeLayer('unclustered-point');
      if (map.getSource('waste-points')) map.removeSource('waste-points');
      
      // Remove event listeners
      map.off('click', 'clusters');
      map.off('mouseenter', 'clusters');
      map.off('mouseleave', 'clusters');
      map.off('click', 'unclustered-point');
      map.off('mouseenter', 'unclustered-point');
      map.off('mouseleave', 'unclustered-point');
    };
  } catch (error) {
    console.error("Error setting up clustering:", error);
  }
};
