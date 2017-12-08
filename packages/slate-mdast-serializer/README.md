# Slate Mdast Serializer

Convert [Slate](https://github.com/ianstormtaylor/slate) trees to [MDAST](https://github.com/syntax-tree/mdast) trees.

## API

### `rule` object

```js
{
  match: fn(slateJson): Boolean,
  matchMdast: fn(mdast, index, parent): Boolean,
  fromMdast: fn(mdast, index, parent, {visitChildren, context}): SlateJson,
  toMdast: fn(slateJson, index, parent, {visitChildren, context}): Mdast
}
```

### `constructor(options): instance`

`options.rules` array of rule objects

### `instance.deserialize(markdown, options): Slate.Value`

`markdown`: `String | Mdast`  
`options`: `Object`

### `instance.deserialize(value, options): String | Mdast`

`value`: `Slate.Value`  
`options`: `Object`

### `instance.fromMdast(mdast, index = 0, parent = null, options)`

### `instance.toMdast(slateJson, index = 0, parent = null, options)`

### `instance.parse(markdown): Mdast`

### `instance.stringify(mdast): String`

## Most Common Rules

### Arbitrary Children

Delegate children processing back to the serializer.

```js
{
  match: matchBlock(TYPE),
  matchMdast: (node) => node.type === 'heading' && node.depth === 1,
  fromMdast: (node, index, parent, {visitChildren}) => ({
    kind: 'block',
    type: TYPE,
    nodes: visitChildren(node)
  }),
  toMdast: (object, index, parent, {visitChildren}) => ({
    type: 'heading',
    depth: 1,
    children: visitChildren(object)
  })
}
```

### Block with Specific Children

Delegate to a `childSerializer`. Another instance with just the rules you want.

Make sure to forward parent information and rest (e.g. context) to the `childSerializer`. 

```js
{
  match: matchBlock(TYPE),
  matchMdast: rule.matchMdast,
  fromMdast: (node, index, parent, rest) => ({
    kind: 'block',
    type: TYPE,
    nodes: childSerializer.fromMdast(node.children, 0, node, rest)
  }),
  toMdast: (object, index, parent, rest) => ({
    type: 'zone',
    identifier: TYPE,
    children: childSerializer.toMdast(object.nodes, 0, object, rest)
  })
}
```

### Void Node

Skip processing children further.

```js
{
  match: matchBlock(TYPE),
  matchMdast: (node) => node.type === 'image',
  fromMdast: (node) => {
    return ({
      kind: 'block',
      type: TYPE,
      data: {
        alt: node.alt,
        src: node.url
      },
      isVoid: true,
      nodes: []
    })
  },
  toMdast: (object) => ({
    type: 'image',
    alt: object.data.alt,
    url: object.data.src
  })
}
```

## Example

[Try it in your browser.](https://runkit.com/tpreusse/slate-mdast-serializer)

```js
const MarkdownSerializer = require('slate-mdast-serializer')
const assert = require('assert')

const paragraph = {
  match: node => node.kind === 'block' && node.type === 'PARAGRAPH',
  matchMdast: node => node.type === 'paragraph',
  fromMdast: (node, index, parent, {visitChildren}) => ({
    kind: 'block',
    type: 'PARAGRAPH',
    nodes: visitChildren(node)
  }),
  toMdast: (object, index, parent, {visitChildren}) => ({
    type: 'paragraph',
    children: visitChildren(object)
  })
}
const bold = {
  match: node => node.kind === 'mark' && node.type === 'BOLD',
  matchMdast: node => node.type === 'strong',
  fromMdast: (node, index, parent, {visitChildren}) => ({
    kind: 'mark',
    type: 'BOLD',
    nodes: visitChildren(node)
  }),
  toMdast: (mark, index, parent, {visitChildren}) => ({
    type: 'strong',
    children: visitChildren(mark)
  })
}

const serializer = new MarkdownSerializer({
  rules: [
    paragraph,
    bold
  ]
})

const md = 'Hello **World**'

const value = serializer.deserialize(md)
const node = value.document.nodes.first()

assert.equal(node.kind, 'block')
assert.equal(node.type, 'PARAGRAPH')

assert.equal(node.text, 'Hello World')

const textKey = node.getFirstText().key
const worldMarks = value.change().select({
  anchorKey: textKey,
  anchorOffset: 5,
  focusKey: textKey,
  focusOffset: 10
}).value.marks

assert.equal(worldMarks.size, 1)
assert.equal(worldMarks.first().type, 'BOLD')

assert.equal(serializer.serialize(value).trimRight(), md)
```
