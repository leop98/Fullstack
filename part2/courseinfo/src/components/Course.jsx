const Header = (props) => {
  return <h1>{props.name}</h1>
}

const Total = (props) => {
  return <p>Number of exercises {props.sumOfExercises}</p>
}

const Part = (props) => {
  return (
    <p>
      {props.parts.name} {props.parts.exercises}
    </p>
  )
}

const Content = (props) => {
  const parts = props.parts.map(element => { return <Part key={element.id} parts={element} /> } )
  return (
    <div>
      {parts}
    </div>
  )
}
const Course = (props) => {

  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts}/>
    </div>
  )
}

export default Course;