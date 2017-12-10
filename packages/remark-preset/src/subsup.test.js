const test = require('tape')
const { parse, stringify } = require('./')

test('sub serialization', assert => {
  const md = `# CO<sub>2</sub>

CO<sub>2</sub>

CO<sub>2eq</sub>

PM<sub>2,5</sub>

<section><h6>ZONE</h6>

PM<sub>2,5</sub>

<hr /></section>
`
  const rootNode = parse(md)

  const checkSub = (node, text) => {
    const sub = node.children
      .find(n => n.type === 'sub')
    assert.ok(sub, 'find sub node')
    assert.equal(sub.children[0].value, text, 'has expected text')
  }

  const subTexts = [
    '2',
    '2',
    '2eq',
    '2,5'
  ]
  subTexts.forEach((subText, index) => {
    checkSub(rootNode.children[index], subText)
  })

  const zone = rootNode.children.find(node => node.type === 'zone')

  assert.ok(zone, 'zone and sub can coexist')
  checkSub(zone.children[0], '2,5')

  assert.equal(stringify(rootNode), md)

  assert.end()
})

test('sup serialization', assert => {
  const md = '40 µg/m<sup>3</sup>\n'
  const rootNode = parse(md)
  const superTexts = [
    '3'
  ]

  superTexts.forEach((supText, index) => {
    const sup = rootNode.children[index].children
      .find(n => n.type === 'sup')
    assert.ok(sup, true)
    assert.equal(sup.children[0].value, supText)
  })

  assert.equal(stringify(rootNode), md)

  assert.end()
})
