import React from 'react'
import {render, wait} from '@testing-library/react'
import {getCourseInfo} from '../api'
import Course from '../course'

jest.mock('../api')

afterEach(() => {
  jest.resetAllMocks()
})

function buildCourse(overrides) {
  return {
    title: 'TEST_COURSE_TITLE',
    subtitle: 'TEST_COURSE_SUBTITLE',
    topics: ['TEST_COURSE_TOPIC'],
    ...overrides,
  }
}

test('course loads and renders the course information', async () => {
  const courseId = '123'
  const title = 'My Awesome Course'
  const subtitle = 'Learn super cool things'
  const topics = ['topic 1', 'topic 2']

  getCourseInfo.mockResolvedValueOnce(buildCourse({title, subtitle, topics}))

  const {getByRole, getByText, getAllByRole, findByRole} = render(
    <Course courseId={courseId} />,
  )

  expect(getCourseInfo).toHaveBeenCalledWith(courseId)
  expect(getCourseInfo).toHaveBeenCalledTimes(1)

  const alert = getByRole('alert')
  expect(alert).toHaveTextContent(/loading/i)

  const titleEl = await findByRole('heading')
  expect(titleEl).toHaveTextContent(title)

  expect(getByText(subtitle)).toBeInTheDocument()

  const topicElsText = getAllByRole('listitem').map(el => el.textContent)
  expect(topicElsText).toEqual(topics)
})

test('an error is rendered if there is a problem getting course info', async () => {
  const message = 'TEST_ERROR_MESSAGE'
  const courseId = '321'
  getCourseInfo.mockRejectedValueOnce({message})

  const {getByRole} = render(<Course courseId={courseId} />)

  expect(getCourseInfo).toHaveBeenCalledWith(courseId)
  expect(getCourseInfo).toHaveBeenCalledTimes(1)

  const alert = getByRole('alert')
  expect(alert).toHaveTextContent(/loading/i)

  await wait(() => expect(alert).toHaveTextContent(message))
})
