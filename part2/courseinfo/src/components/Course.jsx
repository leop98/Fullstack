const Header = (props) => {
  return <h2>{props.name}</h2>
}

const Total = (props) => {
  const sum = props.parts.reduce((total, item) => total + item.exercises, 0);
  return <p><b>Total of {sum} exercises</b></p>
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