import React from 'react'
import {render, wait, cleanup} from '@testing-library/react/pure'
import {getCourseInfo} from '../api'
import Course from '../course'

jest.mock('../api')

function buildCourse(overrides) {
  return {
    title: 'TEST_COURSE_TITLE',
    subtitle: 'TEST_COURSE_SUBTITLE',
    topics: ['TEST_COURSE_TOPIC'],
    ...overrides,
  }
}

describe('Course success', () => {
  const courseId = '123'
  const title = 'My Awesome Course'
  const subtitle = 'Learn super cool things'
  const topics = ['topic 1', 'topic 2']

  let utils
  beforeAll(() => {
    getCourseInfo.mockResolvedValueOnce(buildCourse({title, subtitle, topics}))
  })

  afterAll(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should show a loading spinner', () => {
    utils = render(<Course courseId={courseId} />)
    expect(utils.getByRole('alert')).toHaveTextContent(/loading/i)
  })

  it('should call the getCourseInfo function properly', () => {
    expect(getCourseInfo).toHaveBeenCalledWith(courseId)
  })

  it('should render the title', async () => {
    expect(await utils.findByRole('heading')).toHaveTextContent(title)
  })

  it('should render the subtitle', () => {
    expect(utils.getByText(subtitle)).toBeInTheDocument()
  })

  it('should render the list of topics', () => {
    const topicElsText = utils
      .getAllByRole('listitem')
      .map(el => el.textContent)
    expect(topicElsText).toEqual(topics)
  })
})

describe('Course failure', () => {
  const courseId = '321'
  const message = 'TEST_ERROR_MESSAGE'

  let utils, alert
  beforeAll(() => {
    getCourseInfo.mockRejectedValueOnce({message})
  })

  afterAll(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should show a loading spinner', () => {
    utils = render(<Course courseId={courseId} />)
    alert = utils.getByRole('alert')
    expect(alert).toHaveTextContent(/loading/i)
  })

  it('should call the getCourseInfo function properly', () => {
    expect(getCourseInfo).toHaveBeenCalledWith(courseId)
  })

  it('should render the error message', async () => {
    await wait(() => expect(alert).toHaveTextContent(message))
  })
})
