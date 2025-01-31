import { useState, useEffect } from "react";
import axios from 'axios'

const Weather = ({capital,lat,lon}) => {
    const [weather, setWeather] = useState(null);

    const api_key = import.meta.env.VITE_SOME_KEY

    useEffect(() => {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
          .then(response => {
            setWeather(response.data)
          })
    }, [])
    if (weather != null){
        return (
            <div>
              <h3>Weather in {capital}</h3>
              <p>temperature {weather.main.temp} Celsius</p>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          )
    }
  }

export default Weather