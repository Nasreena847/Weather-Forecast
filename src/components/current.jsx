import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faTemperatureHigh, faTemperatureLow,
faTemperatureQuarter, faTemperatureHalf, faTemperatureEmpty } from '@fortawesome/free-solid-svg-icons';
import humidityHigh from '../images/humidity-high .png';
import humidityLow from '../images/humidity-low.png';
import humidityMid from '../images/humidity-mid.png';
import humidityPercentage from '../images/humidity-percentage.png'
import air from '../images/air.png';
import { Card,CardBody, Dropdown } from 'react-bootstrap'
import { Grid } from "@mui/material";

export default function Weather({WeeklyData, city, state, village,country, reverseLocation, current, Selected}) {
    const temperatureIcon = (temp) => { 
        const celsiusTemp = temp - 273.15;
        if (celsiusTemp > 30) {
          return faTemperatureHigh;
        } else if (celsiusTemp > 25) {
          return faTemperatureThreeQuarters;
        } else if (celsiusTemp > 20) {
          return faTemperatureHalf;
        } else if (celsiusTemp > 15) {
          return faTemperatureQuarter;
        } else if(celsiusTemp < 10) {
          return faTemperatureLow;
        }
        else{
          return faTemperatureEmpty;
        }
      };

      const getHumidityIcon = (humidity) => {
        if (humidity >= 0 && humidity <= 20) {
          return <img src={humidityLow} alt="Low Humidity" />;
        } else if (humidity > 20 && humidity <= 40) {
          return <img src={humidityMid} alt="Medium Low Humidity" />;
        }else if(humidity > 40 && humidity <= 60){
            return <img src={humidityMid} />
        } else if (humidity > 60 && humidity <= 80) {
          return <img src={humidityHigh} alt="Medium High Humidity" />;
        }else if(humidity >= 100){
          return <img src={humidityHigh} />
        } else {
          return <img src={humidityPercentage} alt="High Humidity" />;
        }
      };
    
const RenderCurrentWeather = () => {
    const CurrentData = () => {
      if (!current || !current.weather || !current.weather[0]) return null;
      const { main, weather } = current;
      return (
        <>
       <h1 style={{ textAlign: "center", paddingTop: "40px", color: '#edf2f4'}}>Today</h1>
            <Grid>
              <Grid item xs={Selected ? 12: 100}>
            
                  <div className='weather-container'>
                    <div className='weather-icon '>
                    {current && current.weather && current.weather[0] && (
                        <img
                          id='img'
                          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
                          alt='Weather Icon'
                        />
                      )}
                    </div>
                    <div className='weather-info'>
                      <h1>{village || city || state || country || reverseLocation}</h1>
                      {current && (
                        <>
                          <p>{Math.round(main.temp - 273.15)}°C{console.log(main.temp)}   <FontAwesomeIcon icon={temperatureIcon(main.temp)} size="1x" /> </p>                     
                          <p className="humidity">{getHumidityIcon(main.humidity)}{main.humidity}%</p>
                          <p>{weather[0].description}</p>
                        </>
                      )}
                    </div>
                  </div>
              </Grid>
            </Grid>
            {Selected &&
           <div className="selected">{RenderSelectedDayDetails()}</div>
            }
          </>
        );
      };
      return <CurrentData />;
    };
  
    
const RenderSelectedDayDetails = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDropdownSign, setShowDropdownSign] = useState(window.innerWidth <= 930);
  
  
    const hourlyData = WeeklyData.data.filter(
      (weather) => weather.dt_txt.slice(0, 10) === Selected
      );
  
      if (!hourlyData || hourlyData.length === 0) {
        return null;
      }
  
    const handleShowMoreClick = () => {
      setIsExpanded(!isExpanded);
  
    };
  
    const handleToggle = (nextIsExpanded) => {
      setIsExpanded(nextIsExpanded);
    };
  
    const dropdownSignClass = window.innerWidth <= 930 ? 'show-dropdown-sign' : 'hide-dropdown-sign';
  
    useEffect(() => {
      const handleResize = () => {
        setShowDropdownSign(window.innerWidth <= 930);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    const filteredData = hourlyData.slice(0, isExpanded ? hourlyData.length : 0);
  
    return (
      <>
            <Card className="hourly-dropdown">
          <CardBody>
            <h2 style={{paddingLeft: '15px', transition: 'all 0.5s ease-in'}}>Hourly Forecast for: {new Date(hourlyData[0].dt_txt).toLocaleDateString('en-US')}</h2>
            {showDropdownSign ? (
               <div className={`dropdown-sign ${dropdownSignClass}`}  onClick={handleShowMoreClick}>
              <Dropdown show={isExpanded} style={{position: 'relative'}} onToggle={handleToggle} className="dropdown">   
         <Dropdown.Toggle variant="primary" className="dropdown-toggle">
          <p>{isExpanded ? 'hourlydata' : 'hourlyData'}</p>
                  <img
                  className="dropdown-icon"
           src={isExpanded
            ? 'https://cdn3.iconfinder.com/data/icons/mobile-friendly-ui/100/chevron_up-512.png'
            : 'https://cdn3.iconfinder.com/data/icons/mobile-friendly-ui/100/chevron_down-512.png'
            }
        alt="Dropdown Icon"
          />
           </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu" style={{position: 'fixed'}}>
          {filteredData.map((weather) => (
          <Dropdown.Item key={weather.dt} className="dropdown-item" >
             <p>{new Date(weather.dt_txt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</p>
             <p style={{padding: '10px'}}><img src={air} style={{width: '30px', height: "30px", color: "white"}}/>{weather.wind.speed}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <p>{weather.weather[0].description}</p>
      </Dropdown.Item>
  ))} 
    </Dropdown.Menu>
  </Dropdown>
    </div>
            ) : (
              <>
                <div className="hourly-data">
                <div className="hourly">
               
                {hourlyData.map((weather) => (
            <div key={weather.dt} className="hourly-display">
              <p>{new Date(weather.dt_txt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</p>
  
               <img src={`https://openweathermap.org/img/wn/${weather.weather
               [0].icon}@2x.png`}/>
              <p>{weather.weather[0].description}</p>
            </div>
           ))}
                </div>
                </div>
              </>
            )}
           
          </CardBody>
        </Card>
      </>
    );
  };

  return(
    <RenderCurrentWeather />
  )
}
