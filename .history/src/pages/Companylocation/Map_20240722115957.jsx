import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { GoogleMap, useLoadScript, Marker, Polygon, DrawingManager } from '@react-google-maps/api';
import axios from 'axios';
import { AppContext } from "components/AppContext";
import toast from 'react-hot-toast';
import { API_URL } from 'components/Constant';

const libraries = ['drawing', 'geometry'];

const mapContainerStyle = {
  height: "500px",
  width: "100%"
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDKQyuecIyHYCUzIDVtpKY6I9x100fa890",
    libraries
  });

  const [userLocation, setUserLocation] = useState(null);
  const { state, setState } = useContext(AppContext);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [activePolygonIndex, setActivePolygonIndex] = useState(null); // State for active polygon
  const [polygons, setPolygons] = useState([]);
  const [checkMarker, setCheckMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    if (state.user.company.coordinates) {
      const parsedCoordinates = JSON.parse(state.user.company.coordinates);
      if (Array.isArray(parsedCoordinates)) {
        setPolygons([parsedCoordinates]); // Wrap in an array to handle multiple polygons in the future
        // Optionally set map center to the first polygon's center if needed
        const polygonCenter = getPolygonCenter(parsedCoordinates);
        setMapCenter(polygonCenter);
        // Optionally adjust zoom level
        setMapZoom(14); // Example zoom level for polygons
      } else {
        console.error("Parsed coordinates are not an array:", parsedCoordinates);
      }
    } else {
      setMapCenter(userLocation || defaultCenter);
      setMapZoom(14); // Default zoom level
    }
  }, [state.user.company.coordinates, userLocation]);

  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = truncateToFourDecimals(position.coords.latitude);
          const longitude = truncateToFourDecimals(position.coords.longitude);
          const location = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
          setUserLocation(location);
          // Update map center if no polygons are present
          if (polygons.length === 0) {
            setMapCenter(location);
          }
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    localStorage.setItem('AttendanceAppDesired', JSON.stringify(state.user));
  }, [state]);

  const truncateToFourDecimals = (value) => {
    let valueStr = value.toString();
    let dotIndex = valueStr.indexOf('.');
    if (dotIndex !== -1 && valueStr.length > dotIndex + 4) {
      return valueStr.substring(0, dotIndex + 5);
    }
    return valueStr;
  };

  const checkLocation = () => {
    const checkLat = truncateToFourDecimals(parseFloat(document.getElementById("checkLat").value));
    const checkLon = truncateToFourDecimals(parseFloat(document.getElementById("checkLon").value));
    const isInside = isPointInPolygon(checkLat, checkLon);

    document.getElementById("checkResult").innerHTML = "Is inside polygon: " + isInside;

    const checkLocation = { lat: parseFloat(checkLat), lng: parseFloat(checkLon) };
    setCheckMarker(checkLocation);
  };

  const isPointInPolygon = (lat, lng) => {
    if (!window.google || !window.google.maps || !window.google.maps.geometry) {
      console.error("Google Maps or Geometry library is not loaded");
      return false;
    }

    const point = new window.google.maps.LatLng(lat, lng);
    let isInside = false;

    polygons.forEach((polygon, index) => {
      const paths = polygon.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng));
      const polygonObj = new window.google.maps.Polygon({ paths: paths });
      
      const result = window.google.maps.geometry.poly.containsLocation(point, polygonObj);
      console.log(`Polygon ${index}:`, polygon);
      console.log(`Checking point (${lat}, ${lng}) inside polygon ${index}:`, result);

      if (result) {
        isInside = true;
      }
    });

    return isInside;
  };

  const savePolygon = async (polygon) => {
    const coordinates = polygon.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng()
    }));
    
    const data = new FormData();
    data.append('coordinates', JSON.stringify(coordinates));

    setState(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        company: {
          ...prevData.user.company,
          coordinates: JSON.stringify(coordinates)
        },
      }
    }));

    toast.promise(
      axios.post(`${API_URL}/company/coordinates`, data, {
        headers: {
          'Authorization': `Bearer ${state.user.token}`,
        }
      }),
      {
        loading: 'Saving...',
        success: 'Polygon saved!',
        error: 'Could not save polygon.',
      }
    );
  };

  const getPolygonCenter = (polygonCoords) => {
    if (!polygonCoords || polygonCoords.length === 0) return defaultCenter;
    
    const latitudes = polygonCoords.map(coord => coord.lat);
    const longitudes = polygonCoords.map(coord => coord.lng);
    
    const lat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
    const lng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
    
    return { lat, lng };
  };

  const adjustMapView = () => {
    if (polygons.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      polygons.flat().forEach(coord => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
      });
      if (userLocation) {
        bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
      }
      mapRef.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      adjustMapView();
    }
  }, [polygons, userLocation]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      <p id="locationDisplay">{userLocation ? `Latitude: ${userLocation.lat}, Longitude: ${userLocation.lng}` : "Fetching location..."}</p>
      <p id="areaResult"></p>

      <label htmlFor="checkLat">Latitude to Check:</label>
      <input type="number" step="any" id="checkLat" name="checkLat" />
      <label htmlFor="checkLon">Longitude to Check:</label>
      <input type="number" step="any" id="checkLon" name="checkLon" />
      <button onClick={checkLocation}>Check Location</button>
      <p id="checkResult"></p>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom} // Dynamically set zoom level
        center={mapCenter} // Dynamically set center
        onLoad={onMapLoad}
      >
        {userLocation  && (
          <Marker
            position={userLocation}
            title="Your Location"
          />
        )}

        {polygons.map((polygon, index) => (
          <Polygon
            key={index}
            paths={polygon.map(coord => ({ lat: coord.lat, lng: coord.lng }))}
            options={{
              fillColor: index === activePolygonIndex ? '#00FF00' : '#FF0000', // Highlight active polygon
              fillOpacity: 0.35,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              zIndex: 1
            }}
            onClick={() => {
              setActivePolygonIndex(index); // Set the active polygon index
              setSelectedPolygon(polygon);
            }}
            onMouseUp={() => {
              savePolygon(polygon);
            }}
          />
        ))}

        {checkMarker && (
          <Marker
            position={checkMarker}
            title="Check Location"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
        )}

        <DrawingManager
          onLoad={drawingManager => {
            console.log(drawingManager);
          }}
          onPolygonComplete={polygon => {
            if (selectedPolygon) {
              selectedPolygon.setMap(null);
            }
            const coordinates = polygon.getPath().getArray().map(latLng => ({
              lat: latLng.lat(),
              lng: latLng.lng()
            }));
            setPolygons([coordinates]); // Update polygons state with new polygon
            setActivePolygonIndex(0); // Set new polygon as active
            setSelectedPolygon(polygon);
            setMapCenter(getPolygonCenter(coordinates)); // Center map on new polygon
            savePolygon(polygon);
            document.getElementById("areaResult").innerHTML = "Polygon drawn.";
            console.log('Polygon drawn:', polygon.getPath().getArray());
          }}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon']
            },
            polygonOptions: {
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              zIndex: 1
            }
          }}
        />
      </GoogleMap>
    </div>
  );
}

export default Map;
