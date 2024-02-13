import React, { useState, useEffect } from 'react';
import './App.css';
import ApiCall from './components/Api';
import { InputAdornment } from '@mui/material';
import { grey } from '@mui/material/colors';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import common from '@mui/material/colors/common';


function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const  [permissionDenied, setPermissionDenied] = useState(false);
  const [show, setShow] = useState(!permissionDenied);
  const [loading, setLoading] = useState(false);


  const handleAllowLocation = () => {
    setPermissionDenied(false);
    setShow(false); 
    askForLocationPermission();
  };

  const handleDenyLocation = () => {
    setShow(false);
    setPermissionDenied(true);
    };

    const handleAlertClose = () => {
      setShow(false); 
    };

  const askForLocationPermission  = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchLocationByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setPermissionDenied(true);
          setShow(false);
          setError('Failed to get your location. Please allow location access.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      
    }
  };

  const fetchLocationByCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=4fd2c38c66e64fd6842ce73d4e2cb6d4`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { geometry, components } = data.results[0];
        setLocationName(`${components.city}, ${components.region}, ${components.country}`);
        setData(components);
        setError('');
        setLoading(false);
        setShow(false);
      } else {
        setError('No results found in the API response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const Api_url = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=4fd2c38c66e64fd6842ce73d4e2cb6d4`;
      const response = await fetch(Api_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { geometry, components } = data.results[0];
        setData(components);
        setLatitude(geometry.lat);
        setLongitude(geometry.lng);
        setError('');
        setLoading(false);
      } else {
        setError('No results found in the API response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Check console for details.');
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };
 
  // Render WeatherData only if latitude and longitude are available
  if (error) {
    return <div>Error: {error}</div>;
  }

const white = grey['A100'];
  return (
    <>
     <Alert show={show} variant="success" className='Alert'>
      <div className='Alert-head'>
        <Alert.Heading>Location Access</Alert.Heading>
        <p >Do you want to allow access to your location?</p>
        </div>
        <hr />
        <div className="d-flex justify-content-end Alert-button">
        <Button onClick={handleDenyLocation} variant="outline-danger" className='Deny'>Deny</Button>
          <Button onClick={handleAllowLocation} variant="outline-success" className='Allow'>Allow</Button>
        </div>
      </Alert>
     
      <form onSubmit={handleSubmit} style={{ paddingBottom: '10px' }}>
        <TextField
          sx={{
            width: '500px',
            borderRadius: '30%',
            '& .MuiInputBase-input': {
             color: white,
            },
          }}
          fullWidth
          value={location}
          id='fullwidth'
          onChange={(event) => setLocation(event.target.value)}
          placeholder='Enter a Location'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: common.white }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? <CircularProgress size={24} /> : null}
              </InputAdornment>
            ),
          }}
          onBlur={handleFetchData}
        />
      </form>
      {latitude !== null && longitude !== null && (
        <ApiCall
          longitude={longitude}
          latitude={latitude}
          city={data.city}
          country={data.country}
          state={data.state}
          village={data.village}
          reverseLocation={locationName}
          handleAlertClose={handleAlertClose}
        />
      )}
    </>
  );
}

export default App;
