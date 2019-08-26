import React from 'react'
import ReactDOM from 'react-dom'
import Course from './course'

function App() {
  return <Course courseId="123" />
}

ReactDOM.render(<App />, document.getElementById('root'))
