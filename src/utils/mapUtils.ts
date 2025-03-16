
import mapboxgl from 'mapbox-gl';
import { toast } from "@/components/ui/use-toast";
import { targetBoundary, generateGridPointsInBoundary, filterWasteData, initialWasteData } from './mapData';

// Add target boundary to map
export const addTargetBoundary = (map: mapboxgl.Map) => {
  if (!map || !map.loaded()) return;
  
  try {
    // Check if the source already exists and remove it
    if (map.getSource('target-boundary')) {
      if (map.getLayer('target-boundary-line')) {
        map.removeLayer('target-boundary-line');
      }
      if (map.getLayer('target-boundary-fill')) {
        map.removeLayer('target-boundary-fill');
      }
      map.removeSource('target-boundary');
    }
    
    // Add the boundary as a source
    map.addSource('target-boundary', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [targetBoundary]
        }
      }
    });
    
    // Add a fill layer
    map.addLayer({
      id: 'target-boundary-fill',
      type: 'fill',
      source: 'target-boundary',
      layout: {},
      paint: {
        'fill-color': '#0FA0CE',
        'fill-opacity': 0.15
      }
    });
    
    // Add a line layer
    map.addLayer({
      id: 'target-boundary-line',
      type: 'line',
      source: 'target-boundary',
      layout: {},
      paint: {
        'line-color': '#0FA0CE',
        'line-width': 2,
        'line-dasharray': [2, 1]
      }
    });
  } catch (error) {
    console.error("Error adding target boundary:", error);
  }
};

// Add heatmap layer
export const addHeatmapLayer = (
  map: mapboxgl.Map, 
  wasteData: typeof initialWasteData,
  selectedType: string,
  selectedTimePeriod: string,
  selectedSeverity: string[],
  heatmapVisible: boolean
) => {
  if (!map || !map.loaded()) return;
  
  try {
    // Get filtered data
    const filteredData = filterWasteData(wasteData, selectedType, selectedTimePeriod, selectedSeverity);
    
    // Check if the source already exists and remove it
    if (map.getSource('waste-heat')) {
      if (map.getLayer('waste-heatmap-layer')) {
        map.removeLayer('waste-heatmap-layer');
      }
      map.removeSource('waste-heat');
    }
    
    // Enhanced density of points in the target area
    // This creates a more intense heatmap in the target boundary
    const enhancedHeatData = {
      type: 'FeatureCollection',
      features: [
        //Original data points
        ...filteredData.map(point => ({
          type: 'Feature',
          properties: {
            intensity: point.severity === 'high' ? 1 : point.severity === 'medium' ? 0.6 : 0.3,
            size: point.size,
            type: point.type
          },
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          }
        })),
        
        // Add additional points within the boundary for more intense heatmap
        // Generate a grid of points within the boundary
        ...generateGridPointsInBoundary(targetBoundary, 0.0001, filteredData)
      ]
    };
    
    // Add the GeoJSON source
    map.addSource('waste-heat', {
      type: 'geojson',
      data: enhancedHeatData as any
    });
    
    // Add heatmap layer with improved settings for better visualization
    map.addLayer({
      id: 'waste-heatmap-layer',
      type: 'heatmap',
      source: 'waste-heat',
      layout: {
        visibility: heatmapVisible ? 'visible' : 'none'
      },
      paint: {
        // Weight based on size and intensity for better visualization
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'size'],
          0, 0,
          5, 0.2,
          15, 0.6,
          30, 1
        ],
        // Increased intensity for more prominent visualization
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 5
        ],
        // Enhanced color heatmap based on density
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        // Increased radius for better visibility
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 10,
          10, 25,
          15, 35
        ],
        // Opacity remains high even at higher zoom levels
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          15, 0.8
        ]
      }
    });
  } catch (error) {
    console.error("Error adding heatmap layer:", error);
    toast({
      variant: "destructive",
      title: "Heatmap Error",
      description: "There was an error creating the heatmap. Please try again.",
    });
  }
};

// Render markers
export const renderMarkers = (
  map: mapboxgl.Map,
  markers: mapboxgl.Marker[],
  wasteData: typeof initialWasteData,
  selectedType: string,
  selectedTimePeriod: string,
  selectedSeverity: string[]
): mapboxgl.Marker[] => {
  if (!map || !map.loaded()) return markers;
  
  // Clear existing markers
  markers.forEach(marker => marker.remove());
  
  // Get filtered data
  const filteredData = filterWasteData(wasteData, selectedType, selectedTimePeriod, selectedSeverity);
  
  const newMarkers: mapboxgl.Marker[] = [];
  
  // Add new markers
  filteredData.forEach(point => {
    const el = document.createElement('div');
    el.className = 'waste-marker';
    el.innerHTML = `
      <div class="relative">
        <span class="absolute inset-0 rounded-full ${point.severity === 'high' ? 'bg-rose-500/50' : point.severity === 'medium' ? 'bg-amber-500/50' : 'bg-emerald-500/50'} animate-ping"></span>
        <span class="absolute inset-0 rounded-full ${point.severity === 'high' ? 'bg-rose-500' : point.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse-subtle"></span>
      </div>
    `;

    const marker = new mapboxgl.Marker(el)
      .setLngLat([point.lng, point.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${point.type.charAt(0).toUpperCase() + point.type.slice(1)} Waste</h3>
            <p>Severity: ${point.severity}</p>
            <p>Size: ${point.size} tons</p>
            <p>Detected: ${new Date(point.timestamp).toLocaleString()}</p>
          </div>
        `))
      .addTo(map);
    
    newMarkers.push(marker);
  });
  
  return newMarkers;
};

// Fly to coordinates
export const flyToCoordinates = (map: mapboxgl.Map, boundary: number[][]) => {
  if (!map) return;
  
  // Calculate the center of the boundary
  const centerLng = (boundary[0][0] + boundary[2][0]) / 2;
  const centerLat = (boundary[0][1] + boundary[2][1]) / 2;
  
  map.flyTo({
    center: [centerLng, centerLat],
    zoom: 15, // Zoom in more to see the boundary clearly
    pitch: 50,
    bearing: 0,
    duration: 2000
  });
};
