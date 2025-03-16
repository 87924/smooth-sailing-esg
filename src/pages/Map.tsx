
import React, { useState, useEffect, useRef } from 'react';
import { Layers, Filter, AlertTriangle, Info, Trash2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";

const Map = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  const rotationRequestId = useRef<number | null>(null);

  // State for filters
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("24h");
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(["low", "medium", "high"]);

  // Target area boundary from provided coordinates
  const targetBoundary = [
    [-87.623357, 15.975562],
    [-87.621791, 15.975562],
    [-87.621791, 15.974811],
    [-87.623357, 15.974811],
    [-87.623357, 15.975562]
  ];

  // Initial waste data with focus on the provided coordinates
  const [wasteData, setWasteData] = useState([
    { id: 1, type: 'plastic', severity: 'high', lat: 15.975562, lng: -87.623357, size: 25, timestamp: Date.now() },
    { id: 2, type: 'plastic', severity: 'high', lat: 15.975562, lng: -87.621791, size: 30, timestamp: Date.now() },
    { id: 3, type: 'industrial', severity: 'medium', lat: 15.974811, lng: -87.621791, size: 15, timestamp: Date.now() },
    { id: 4, type: 'oil', severity: 'low', lat: 15.974811, lng: -87.623357, size: 10, timestamp: Date.now() },
    
    { id: 5, type: 'plastic', severity: 'high', lat: 15.975000, lng: -87.622500, size: 28, timestamp: Date.now() },
    { id: 6, type: 'industrial', severity: 'medium', lat: 15.975300, lng: -87.622000, size: 18, timestamp: Date.now() },
    { id: 7, type: 'chemical', severity: 'high', lat: 15.974900, lng: -87.622800, size: 22, timestamp: Date.now() },
    { id: 8, type: 'plastic', severity: 'medium', lat: 15.975100, lng: -87.623100, size: 16, timestamp: Date.now() },
    { id: 9, type: 'oil', severity: 'high', lat: 15.974700, lng: -87.622200, size: 24, timestamp: Date.now() },
    { id: 10, type: 'plastic', severity: 'high', lat: 15.975800, lng: -87.622600, size: 27, timestamp: Date.now() },
    
    { id: 11, type: 'industrial', severity: 'medium', lat: 35.0, lng: -70.0, size: 15, timestamp: Date.now() },
    { id: 12, type: 'oil', severity: 'low', lat: 15.0, lng: -90.0, size: 5, timestamp: Date.now() },
    { id: 13, type: 'chemical', severity: 'medium', lat: -10.0, lng: 10.0, size: 18, timestamp: Date.now() }
  ]);

  // Get filtered data based on user selections
  const getFilteredData = () => {
    let timeThreshold: number;
    const now = Date.now();

    // Determine time threshold based on selected period
    switch (selectedTimePeriod) {
      case "24h":
        timeThreshold = now - 1000 * 60 * 60 * 24;
        break;
      case "7d":
        timeThreshold = now - 1000 * 60 * 60 * 24 * 7;
        break;
      case "30d":
        timeThreshold = now - 1000 * 60 * 60 * 24 * 30;
        break;
      case "90d":
        timeThreshold = now - 1000 * 60 * 60 * 24 * 90;
        break;
      default:
        timeThreshold = 0;
    }

    // Filter waste data based on selections
    return wasteData.filter(item => {
      const typeMatch = selectedType === "all" || item.type === selectedType;
      const severityMatch = selectedSeverity.includes(item.severity);
      const timeMatch = item.timestamp >= timeThreshold;
      return typeMatch && severityMatch && timeMatch;
    });
  };

  // Setup map with the token provided
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Set the Mapbox token (using the provided token)
    mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbWFsaTA3ODYiLCJhIjoiY20yYWRiZWw0MGQxZDJvczd6bzc4aDUzMiJ9.FUTLwMNaICKfoct8yJqVQQ";
    
    try {
      // Initialize map with improved stability settings and focused on specified coordinates
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 14, // Higher zoom to focus on target area
        center: [-87.6225, 15.9752], // Center between the coordinates
        pitch: 45,
        minZoom: 0.5,
        maxZoom: 18,
        renderWorldCopies: true,
        attributionControl: false,
        preserveDrawingBuffer: true,
        antialias: true,
        trackResize: true,
        fadeDuration: 0
      });

      // Add navigation controls
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
      });
      map.current.addControl(nav, 'top-right');
      
      // Add attribution control in a subtle position
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

      // Add scale
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      // Set up map load event with improved error handling
      map.current.on('load', () => {
        try {
          if (!map.current) return;

          // Add atmosphere and fog effects for visual appeal
          map.current.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });

          // Add target area boundary
          addTargetBoundary();

          // Add heatmap source
          addHeatmapLayer();
          
          // Add points source for individual markers
          renderMarkers();
          
          setLoading(false);
          
          // Notify user that the map has loaded
          toast({
            title: "Map loaded successfully",
            description: "Waste detection heatmap is now active in the specified coordinates",
          });
        } catch (err) {
          console.error('Error during map load:', err);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Map error",
            description: "Failed to initialize map components",
          });
        }
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          variant: "destructive",
          title: "Map error occurred",
          description: "The map encountered an error. Please refresh the page.",
        });
      });

      return () => {
        if (rotationRequestId.current) {
          cancelAnimationFrame(rotationRequestId.current);
          rotationRequestId.current = null;
        }
        
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Map initialization failed",
        description: "There was an error loading the map",
      });
    }
  }, []);

  // Add target boundary area to the map
  const addTargetBoundary = () => {
    if (!map.current || !map.current.loaded()) return;
    
    try {
      // Check if the source already exists and remove it
      if (map.current.getSource('target-boundary')) {
        if (map.current.getLayer('target-boundary-line')) {
          map.current.removeLayer('target-boundary-line');
        }
        if (map.current.getLayer('target-boundary-fill')) {
          map.current.removeLayer('target-boundary-fill');
        }
        map.current.removeSource('target-boundary');
      }
      
      // Add the boundary as a source
      map.current.addSource('target-boundary', {
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
      map.current.addLayer({
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
      map.current.addLayer({
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

  // Add heatmap layer function with enhanced stability and visualization
  const addHeatmapLayer = () => {
    if (!map.current || !map.current.loaded()) return;
    
    try {
      // Get filtered data
      const filteredData = getFilteredData();
      
      // Check if the source already exists and remove it
      if (map.current.getSource('waste-heat')) {
        if (map.current.getLayer('waste-heatmap-layer')) {
          map.current.removeLayer('waste-heatmap-layer');
        }
        map.current.removeSource('waste-heat');
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
      map.current.addSource('waste-heat', {
        type: 'geojson',
        data: enhancedHeatData as any
      });
      
      // Add heatmap layer with improved settings for better visualization
      map.current.addLayer({
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

  // Helper function to generate a grid of points within the boundary
  // This enhances the heatmap visualization in the target area
  const generateGridPointsInBoundary = (boundary: number[][], spacing: number, baseData: any[]) => {
    if (boundary.length < 4) return [];
    
    // Calculate bounding box
    const lngs = boundary.map(coord => coord[0]);
    const lats = boundary.map(coord => coord[1]);
    
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    const gridPoints: any[] = [];
    
    // Create a grid of points within the bounding box
    for (let lng = minLng; lng <= maxLng; lng += spacing) {
      for (let lat = minLat; lat <= maxLat; lat += spacing) {
        // Check if point is inside the polygon (simple test for rectangle)
        if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
          // Get closest real data point to inherit properties
          const closestDataPoint = findClosestDataPoint(lng, lat, baseData);
          
          gridPoints.push({
            type: 'Feature',
            properties: {
              intensity: closestDataPoint.severity === 'high' ? 0.9 : 
                         closestDataPoint.severity === 'medium' ? 0.5 : 0.2,
              size: closestDataPoint.size * 0.8, // Slightly less intense than real points
              type: closestDataPoint.type
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          });
        }
      }
    }
    
    return gridPoints;
  };

  // Find closest data point to inherit properties
  const findClosestDataPoint = (lng: number, lat: number, data: any[]) => {
    if (data.length === 0) {
      // Default fallback if no data
      return { severity: 'medium', size: 15, type: 'plastic' };
    }
    
    let minDistance = Infinity;
    let closestPoint = data[0];
    
    data.forEach(point => {
      const distance = Math.sqrt(
        Math.pow(lng - point.lng, 2) + 
        Math.pow(lat - point.lat, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    return closestPoint;
  };

  // Update heatmap when filters change
  useEffect(() => {
    if (!map.current || loading || !map.current.loaded()) return;
    
    // Update heatmap and markers with filtered data
    addTargetBoundary();
    addHeatmapLayer();
    renderMarkers();
    
  }, [selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible, loading]);

  // Render markers for waste data
  const renderMarkers = () => {
    if (!map.current || !map.current.loaded()) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Get filtered data
    const filteredData = getFilteredData();
    
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
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
  };

  // Toggle heatmap visibility
  const toggleHeatmap = () => {
    if (!map.current) return;
    
    setHeatmapVisible(!heatmapVisible);
  };

  // Apply all filters
  const applyFilters = () => {
    if (!map.current) return;
    
    // Re-render markers and update heatmap
    renderMarkers();
    addHeatmapLayer();
    
    // Close filter panel
    setIsFilterOpen(false);
    
    // Notify user
    toast({
      title: "Filters Applied",
      description: "Map view has been updated based on your filters",
    });
  };

  // Toggle severity filter
  const toggleSeverity = (severity: string) => {
    if (selectedSeverity.includes(severity)) {
      // Remove severity if it's already selected (but don't allow empty array)
      if (selectedSeverity.length > 1) {
        setSelectedSeverity(prev => prev.filter(s => s !== severity));
      }
    } else {
      // Add severity if not already selected
      setSelectedSeverity(prev => [...prev, severity]);
    }
  };

  // Add function to fly to the specific coordinates
  const flyToCoordinates = () => {
    if (!map.current) return;
    
    // Calculate the center of the boundary
    const centerLng = (targetBoundary[0][0] + targetBoundary[2][0]) / 2;
    const centerLat = (targetBoundary[0][1] + targetBoundary[2][1]) / 2;
    
    map.current.flyTo({
      center: [centerLng, centerLat],
      zoom: 15, // Zoom in more to see the boundary clearly
      pitch: 50,
      bearing: 0,
      duration: 2000
    });
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="glass-container p-6 rounded-xl max-w-md w-full mx-4 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-rotate mb-4"></div>
              <h3 className="text-xl font-semibold">Loading Map</h3>
              <p className="text-sm text-foreground/70 mt-2">
                Initializing waste detection heatmap...
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-ocean-waves opacity-[0.02] animate-wave pointer-events-none"></div>
        
        {/* Map container */}
        <div ref={mapContainer} className="absolute inset-0" style={{ backgroundColor: "#111927" }}></div>
        
        <div className="absolute top-4 right-4 flex flex-col space-y-4">
          <button 
            className={`glass-container p-2 rounded-lg hover:bg-white/5 transition-colors ${heatmapVisible ? 'bg-ocean/10' : ''}`}
            title={heatmapVisible ? "Hide Heatmap" : "Show Heatmap"}
            onClick={toggleHeatmap}
            aria-pressed={heatmapVisible}
          >
            <Layers className="w-5 h-5" />
          </button>
          
          <button 
            className={`glass-container p-2 rounded-lg hover:bg-white/5 transition-colors ${isFilterOpen ? 'bg-ocean/10' : ''}`}
            title="Filter Data"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-pressed={isFilterOpen}
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <button 
            className="glass-container p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Focus on Target Area"
            onClick={flyToCoordinates}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        
        {isFilterOpen && (
          <div className="absolute top-4 right-16 glass-container rounded-xl p-5 w-64 md:w-80 animate-fade-in z-10">
            <h3 className="font-semibold mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter Data
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground/70 block mb-1">Waste Type</label>
                <select 
                  className="w-full rounded-md bg-secondary border border-white/10 p-2 text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="plastic">Plastic</option>
                  <option value="industrial">Industrial</option>
                  <option value="oil">Oil Spill</option>
                  <option value="chemical">Chemical</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-foreground/70 block mb-1">Time Period</label>
                <select 
                  className="w-full rounded-md bg-secondary border border-white/10 p-2 text-sm"
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-foreground/70 block mb-1">Severity Level</label>
                <div className="flex space-x-2">
                  <button 
                    className={`p-2 rounded-md ${selectedSeverity.includes('low') ? 'bg-emerald-500/50' : 'bg-emerald-500/20'} flex-1 text-sm`}
                    onClick={() => toggleSeverity('low')}
                  >
                    Low
                  </button>
                  <button 
                    className={`p-2 rounded-md ${selectedSeverity.includes('medium') ? 'bg-amber-500/50' : 'bg-amber-500/20'} flex-1 text-sm`}
                    onClick={() => toggleSeverity('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    className={`p-2 rounded-md ${selectedSeverity.includes('high') ? 'bg-rose-500/50' : 'bg-rose-500/20'} flex-1 text-sm`}
                    onClick={() => toggleSeverity('high')}
                  >
                    High
                  </button>
                </div>
              </div>
              
              <button 
                className="glass-button ripple w-full mt-2"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 glass-container rounded-xl p-4 animate-fade-in">
          <h3 className="font-semibold text-sm mb-3">Waste Detection Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
              <span>Critical (25+ tons)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span>Moderate (10-25 tons)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
              <span>Low (0-10 tons)</span>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
              <div className="flex items-center">
                <div className="w-12 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded mr-2"></div>
                <span>Heatmap Intensity</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
              <div className="flex items-center">
                <div className="h-3 w-8 border border-[#0FA0CE] border-dashed mr-2"></div>
                <span>Target Boundary</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 glass-container rounded-xl p-4 max-w-sm animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-ocean/10 shrink-0">
              <AlertTriangle className="w-5 h-5 text-ocean" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Target Area Heatmap</h3>
              <p className="text-xs text-foreground/70 mt-1">
                Focused on coordinates [-87.623357, 15.975562] to [-87.621791, 15.974811].
                Boundary highlighted with dashed line. Heatmap intensity increased in this area.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary border-t border-white/5 py-3">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-foreground/70 text-xs">Active Hotspots</div>
              <div className="font-semibold">{getFilteredData().length}</div>
            </div>
            <div className="text-center">
              <div className="text-foreground/70 text-xs">Total Waste</div>
              <div className="font-semibold">
                {getFilteredData().reduce((sum, point) => sum + point.size, 0)} tons
              </div>
            </div>
            <div className="text-center">
              <div className="text-foreground/70 text-xs">Target Area</div>
              <div className="font-semibold">
                Honduras Bay
              </div>
            </div>
            <div className="text-center">
              <div className="text-foreground/70 text-xs">Filter Settings</div>
              <div className="font-semibold text-xs truncate">
                {selectedType === "all" ? "All Types" : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} • 
                {selectedSeverity.length === 3 ? "All Severities" : selectedSeverity.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
