import { useState, useEffect } from 'react'
import Weather from './weather'

const Country = ({props}) => {
  return props.map((country) => (
    <div key={country.name.common}>
      <h2>
        {country.name.common}
      </h2>
      <p>
        capital {country.capital}
      </p>
      <p>
        area {country.area}
      </p>
      <h4>
        languages:
      </h4>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt = {country.flags.alt}></img>
      <Weather capital = {country.capital} lat={country.capitalInfo.latlng[0]} lon={country.capitalInfo.latlng[1]}/>
    </div>
  ))
}

const Countries = ({ props, filterValue}) => {
    const [clickedCountry, setSelectedCountry] = useState([])
  
    useEffect(() => {
      setSelectedCountry([])
    }, [filterValue]) 
  
    const handleShowCountry = (country) => {
      setSelectedCountry([country])
    }
  
    if (props.length > 10){
      return (
        <p>
          Too many countries, specify filter
        </p>
      )
    }
    if (props.length === 1){
      return (
        <Country props = {props} />
      )
    }
    if (clickedCountry.length > 0){
      return (
        <Country props = {clickedCountry} />
      )
    }
    return props.map((country) => (
      <div key={country.name.common}>
        <p>
          {country.name.common} <button onClick={() =>  handleShowCountry(country)}>show</button>
        </p>
      </div>
    ))
  }

  export default Countries