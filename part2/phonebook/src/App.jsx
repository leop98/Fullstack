import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'


const Persons = ({ props }) => {
  return (
    <div>
      {props}
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, newNumber, handleNewName, handleNewNumber }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
          name: <input value={newName}
          onChange={handleNewName}
          />
        <div>
          number: <input  value={newNumber}
          onChange={handleNewNumber}
          />
        </div>
      </div>
      <button type="submit">add</button>
    </form>
  )
}

const Filter = ({text, value, handleNewChange}) => {
  return(
  <div>
    {text} <input value={value} onChange={handleNewChange}/>
  </div>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  else if (type === "success") {
    return (
      <div className="added">
        {message}
      </div>
    )
  }

  else if (type === "error") {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName,setFilterName] = useState('')
  const [newMessage, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personService
      .getAll()
        .then(response => {
        setPersons(response)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    const checkName = persons.find(props => props.name.toLowerCase() === personObject.name.toLowerCase())
    const updatedPerson = {
      ...checkName,
      number: newNumber,
    }
    if (checkName && checkName.number === personObject.number) {
      alert(`${personObject.name} is already added to phonebook`)
    }
    else if (checkName && checkName.number !== personObject.number) {
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(checkName.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== checkName.id? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessageType('success')
          setMessage(
            `Updated ${personObject.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          
        })
        .catch(error => {
          setMessageType('error')
          setMessage(`Information of ${newName} has already been removed from server`)
        })
      }
      else {
        setNewName('')
        setNewNumber('')
      }
    }
    else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
    }
  }

  const deleteName = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deletePerson(id)
      setPersons(persons.filter(persons => persons.id !== id))
      setMessage(
        `Deleted ${person.name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filter = persons.map(props => props.name.toLowerCase().includes(filterName.toLowerCase()))?
  persons.filter(props => props.name.toLowerCase().includes(filterName.toLowerCase()))
  : persons

  const PeopleList = ({ name, number, id }) => {
    return (
      <p>
        {name} {number} <button type="submit" onClick={() =>  deleteName(id)}>delete</button>
      </p>
    )
  }

  const namesAfterFilter = 
      filter.map(person => (
        <PeopleList key={person.id} name={person.name} number={person.number} id = {person.id} />
        )
      )

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} type = {messageType}/>
      <Filter text = "filter shown with"
        value = {filterName}
        handleNewChange = {handleFilter}
      />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit = {addName}
        newName = {newName}
        newNumber = {newNumber}
        handleNewName = {handleNameChange}
        handleNewNumber = {handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons props = {namesAfterFilter}/>
    </div>
  )

}

export default App