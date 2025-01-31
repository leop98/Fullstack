import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './services/countries'

const Filter = ({text, value, handleNewChange}) => {
  return(
  <div>
    {text} <input value={value} onChange={handleNewChange}/>
  </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterCountries, setFilter] = useState('')

  useEffect(() => {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
  }, [])

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const filter = countries.map(props => props.name.common.toLowerCase().includes(filterCountries.toLowerCase()))?
  countries.filter(props => props.name.common.toLowerCase().includes(filterCountries.toLowerCase()))
  : countries

  return (
    <div>
      <Filter text = "find countries"
        value = {filterCountries}
        handleNewChange = {handleFilter}
      />
      <Countries props={filter} filterValue={filterCountries}/>
    </div>
  )
}

export default App