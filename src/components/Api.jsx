import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureThreeQuarters, faTemperatureHigh, faTemperatureLow, faTemperatureQuarter, faTemperatureHalf
, faTemperatureEmpty} from '@fortawesome/free-solid-svg-icons';
import icon01d from '../images/01d.png'
import Weather from "./current";
import { motion, useAnimation } from "framer-motion";
import  axios  from "axios";
import { Card} from 'react-bootstrap'
import { Grid} from '@mui/material';
import Alert from "@mui/material/Alert";
import './Api.css'

export default function ApiCall({latitude, longitude, city, country, state, village, reverseLocation}) {
    const [data, setData] = useState({
        current: null,
        weekly: {
            data: null,
            selectedDay: null
        }
});
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 930);
    const [dailyData, setDailyData] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [AlertOpen, setAlertOpen] = useState(true)

    const fetchData = async() => {
  try{
        const api_key = 'f2611581585d248b1136a44f06045b3c';
        const Currenturl = `https://api.openweathermap.org/data/2.5/weather`;
        const WeeklyUrl = `https://api.openweathermap.org/data/2.5/forecast`;
        const params = {
            lat: latitude,
            lon: longitude,
            appid: api_key,
        };
        const [currentResponse, weeklyResponse] = await Promise.all([
            axios.get(Currenturl, {params}),
            axios.get(WeeklyUrl, {params}),
          ]);

          const currentData = currentResponse.data;
          const weeklyData = weeklyResponse.data.list;

          console.log('current data: ', currentData);
          console.log('weekly data:', weeklyData)
    
          setData({
            current: currentData,
            weekly: {
              data: weeklyData,
              selectedDay: null,
            },
          });

       
        setDailyData(dailyData);
        setLastFetchTime(new Date());
        console.log('data:' , data)
  }
        catch(error){
            console.error('error fetching weather data' ,error);
        }
    };


useEffect(() => {
   
        fetchData();
      
  }, [latitude, longitude]);

  const handleDayClick = (day) => {
    console.log('Selected day:', day);
    setSelectedDay(day)
    setData({
      ...data,
      weekly: {
        ...data.weekly,
        selectedDay: day,
      },
    });
    console.log('updated data', data)
  };

const renderWeeklyWeather = () => { 

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 930);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const WeeklyData = ({ weeklyData, selectedDay, handleDayClick }) => {
    if (!weeklyData) return null;
  
  console.log('rendering weekly data') 
  if (!data || !data.weekly || !data.weekly.data) return null;

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

 return ( 
    <>
  {data?.weekly?.selectedDay ? (
    <div className="selected-container">
    <Grid>
    <h2 className="weekly-h1">Weekly Data</h2>
      {data.weekly.data.filter(
        (weather) => weather.dt_txt.slice(11, 19) === "12:00:00"
      ).map((day, index) => (
        <Grid item={isSmallScreen ? 6 : 12}>
        <Card key={index}
          className={`selected-five-info ${data.weekly.selectedDay === day.dt_txt.slice(0, 10) ? "selected" : ""} `}
          onClick={() => handleDayClick(day.dt_txt.slice(0, 10))}
        >
          <p>{` ${new Date(day.dt_txt.slice(0, 10)).toLocaleDateString('en-US', { weekday: 'long' })}`}</p>
          <p style={{paddingLeft:"15px"}}>{Math.round(day.main.temp - 273.15)}°C <FontAwesomeIcon icon={temperatureIcon(day.main.temp)} size="1x" /></p>

          
          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            onError={(e) => {
              e.target.src = icon01d; // Set a default image in case of an error
            }}
          />
          <p>{` ${day.weather[0].description}`}</p>
        </Card>
        </Grid>
      ))}
      </Grid>
    </div>
 ) : (
  <>
   <h2 style={{textAlign: 'center', color: '#edf2f4'}}>Weekly Data</h2>
  {alert()}
    <div className='container'>
    <div className='info'>
      {data.weekly.data.filter(
        (weather) => weather.dt_txt.slice(11, 19) === "12:00:00"
      ).map((day, index) => (
        <Card key={index}
          className={`five-info ${data.weekly.selectedDay === day.dt_txt.slice(0, 10) ? "selected" : ""} ${selectedDay ? "shrink" : ""}`}
          onClick={() => handleDayClick(day.dt_txt.slice(0, 10))}
        >
          <p>{` ${new Date(day.dt_txt.slice(0, 10)).toLocaleDateString('en-US', { weekday: 'long' })}`}</p>
          <p>{Math.round(day.main.temp - 273.15)}°C <FontAwesomeIcon icon={temperatureIcon(day.main.temp)} size="1x" /></p>
          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            onError={(e) => {
              e.target.src = icon01d; // Set a default image in case of an error
            }}
          />
          <p>{` ${day.weather[0].description}`}</p>
        </Card>
      ))}
    </div>
    </div>
    </>
  )}
  </>
  );
};

return <WeeklyData weeklyData={data.weekly.data} selectedDay={selectedDay} handleDayClick={handleDayClick} />;
};

const alert = () => {
  
  const handleAlertClose = () => {
    console.log("Alert close button clicked");
    setAlertOpen(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertOpen(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []); 

  return (
    <div className="position-relative">
      {AlertOpen && (
   <Alert severity="info" onClose={handleAlertClose} className="weekly-Alert">
   Click on the weekly data to view hourly data
    </Alert>
      )}
      </div>
  )
}


const animationControls = useAnimation();
const goDownAnimation = useAnimation();

useEffect(() => {
  const animateWeeklyData = async () => {
    if (data.weekly.selectedDay) {
      if (isSmallScreen) {
        await animationControls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 },
        });
        await goDownAnimation.start({
          opacity: 1,
          y: -50, 
          transition: { duration: 0.5 },
        });
      } else {
        await animationControls.start({
          opacity: 1,
          y: -50,
          transition: { duration: 0.5 },
        });
        await goDownAnimation.start({
          opacity: 1,
          y: -50,
          transition: { duration: 0.5 },
        });
      }
    } else {
      await animationControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
      await goDownAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    }
  };
  animateWeeklyData();
}, [data.weekly.selectedDay, isSmallScreen, animationControls, goDownAnimation]);

return (
  <>
  <div style={{marginTop: '10px'}}>
 {data.weekly.selectedDay ? (
  <Grid container spacing={0.002}>
    <Grid item xs={12} sm={6}>
      <motion.div animate={animationControls}>
          <Weather current={data.current}
           Selected={data.weekly.selectedDay}
           WeeklyData={data.weekly}
           city={city}
           country={country}
           state={state}
           village={village}
           reverseLocation={reverseLocation}
           />
      </motion.div>
    </Grid>
    <Grid item xs={isSmallScreen ? 12 : 6} >
      <motion.div animate={goDownAnimation}>
      {renderWeeklyWeather()}
      </motion.div>
    </Grid>
  </Grid>
) : (
  <Grid container spacing={2}>
    <Grid item xs={12}>
    <motion.div animate={animationControls}>
    <Weather current={data.current}
           Selected={data.weekly.selectedDay}
           city={city}
           country={country}
           state={state}
           village={village}
           reverseLocation={reverseLocation}
           />
      </motion.div>
    </Grid>
    <Grid item xs={12} style={{paddingLeft: '0'}}>
    <motion.div animate={animationControls}>
      {renderWeeklyWeather()}
      </motion.div>
    </Grid>
  </Grid>
)}

</div>
  </>
   )
  }