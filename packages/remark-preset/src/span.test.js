const test = require('tape')
const { parse, stringify } = require('./')

test('span serialization', assert => {
  const md = '<span data-number="10000">10\'000</span>\n'
  const rootNode = parse(md)

  const p = rootNode.children[0]
  assert.equal(p.type, 'paragraph')

  const number = p.children[0]
  assert.equal(number.type, 'span')
  assert.equal(number.data.number, '10000')
  assert.equal(number.children[0].value, '10\'000')

  assert.equal(stringify(rootNode), md)

  assert.end()
})

const getNumber = rootNode => rootNode.children[0].children[0]

test('span data encoding', assert => {
  const md = '<span data-number="10000">10\'000</span>\n'
  const rootNode = parse(md)
  const number = getNumber(rootNode)
  const complexData = JSON.stringify({
    value: 10000,
    unit: 'CHF'
  })
  number.data.number = complexData

  const cycledNumber = getNumber(parse(stringify(rootNode)))

  assert.equal(cycledNumber.data.number, complexData)

  assert.end()
})


test('span data is string only', assert => {
  const md = '<span data-number="10000">10\'000</span>\n'
  const rootNode = parse(md)
  const number = getNumber(rootNode)
  number.data.number = {
    value: 10000,
    unit: 'CHF'
  }

  assert.throws(
    () => {
      stringify(rootNode)
    },
    /mdast span/,
    'Prevents you from serializing non string data'
  )

  assert.end()
})

test('span data contains equal sign', assert => {
  const md = '<span data-attr="foo=bar">child</span>\n'
  const rootNode = parse(md)

  const { data } = rootNode.children[0].children[0]

  assert.equal(data.attr, 'foo=bar')
  assert.end()
})

test('span data contains multiple equal signs', assert => {
  const md = '<span data-attr="foo=bar, fizz=buzz">child</span>\n'
  const rootNode = parse(md)

  const { data } = rootNode.children[0].children[0]

  assert.equal(data.attr, 'foo=bar, fizz=buzz')
  assert.end()
})

test('span data contains data attribute resembling data', assert => {
  const md = '<span data-attr="data-hero=&#x22;Spiderman&#x22;">child</span>\n'
  const rootNode = parse(md)

  const { data } = rootNode.children[0].children[0]

  assert.equal(data.attr, 'data-hero="Spiderman"')
  assert.end()
})
