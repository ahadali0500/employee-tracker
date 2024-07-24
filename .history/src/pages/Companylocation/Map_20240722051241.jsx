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

const center = {
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
  const [polygons, setPolygons] = useState([]);
  const [checkMarker, setCheckMarker] = useState(null);
  useEffect(() => {
    if (state.user.company.coordinates) {
      setPolygons(JSON.parse(state.user.company.coordinates));
    }
  }, [state.user.coordinates]);
  console.log(polygons);
  console.log(state);  
  
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
          setUserLocation({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
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
    const point = new window.google.maps.LatLng(lat, lng);
    let isInside = false;

    polygons.forEach(polygon => {
      const paths = polygon.coordinates.map(coord => new window.google.maps.LatLng(coord.lat, coord.lng));
      const polygonObj = new window.google.maps.Polygon({ paths: paths });
      if (window.google.maps.geometry.poly.containsLocation(point, polygonObj)) {
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
        user.coordinates: newCoordinatesString
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
        zoom={18}
        center={userLocation || center}
        onLoad={onMapLoad}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
          />
        )}

        {polygons.map((polygon, index) => (
          <Polygon
            key={index}
            paths={polygons.map(coord => ({ lat: coord.lat, lng: coord.lng }))}
            options={{
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeWeight: 2,
              clickable: false,
              editable: true,
              zIndex: 1
            }}
            onMouseUp={(e) => {
              setSelectedPolygon(e.overlay);
              savePolygon(e.overlay);
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
            setSelectedPolygon(polygon);
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
              clickable: false,
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
