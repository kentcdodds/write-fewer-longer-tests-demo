import React from 'react'
import * as api from './api'

function CourseInfo({course}) {
  const {title, subtitle, topics} = course
  return (
    <div>
      <h1>{title}</h1>
      <strong>{subtitle}</strong>
      <ul>
        {topics.map(t => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

function Course({courseId}) {
  const [state, setState] = React.useState({
    loading: false,
    course: null,
    error: null,
  })
  const {loading, course, error} = state
  React.useEffect(() => {
    setState({loading: true, course: null, error: null})
    api
      .getCourseInfo(courseId)
      .then(
        data => setState({loading: false, course: data, error: null}),
        e => setState({loading: false, course: null, error: e}),
      )
  }, [courseId])
  return (
    <>
      <div role="alert" aria-live="polite">
        {loading ? 'Loading...' : error ? error.message : null}
      </div>
      {course ? <CourseInfo course={course} /> : null}
    </>
  )
}

export default Course
