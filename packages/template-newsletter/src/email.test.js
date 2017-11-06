import test from 'tape'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { renderEmail } from 'mdast-react-render/lib/email'
import newsletterEmailSchema from './email'

import mdast from './sample'

Enzyme.configure({ adapter: new Adapter() })

test('render for email', assert => {
  assert.doesNotThrow(() => {
    renderEmail(mdast, newsletterEmailSchema, false)
  })

  assert.end()
})
