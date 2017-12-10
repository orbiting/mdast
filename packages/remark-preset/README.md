# Remark Preset

Preconfigured [remark](https://github.com/remarkjs/remark) for our projects.

## API

### `parse`

```js
import { parse } from '@orbiting/remark-preset'

parse(md): Mdast
```

`md`: String
The markdown to parse.

Returns a mdast tree.

### `stringify`

```js
import { stringify } from '@orbiting/remark-preset'

stringify(mdast): String
```

`md`: String
The mdast tree to stringify.

Returns a markdown string.

## Features

### Custom Mdast Type `zone`

```html
<section><h6>IDENTIFIER</h6>

Group arbitrary markdown

<hr /></section>
```

Yields following AST:

```js
{
  type: 'zone',
  identfier: 'IDENTIFIER',
  children: [{type: 'paragraph', children: [
    {type: 'text', value: 'Group arbitrary markdown'}
  ]}]
}
```

Zones can be nested and can have data (stringified as json in a code node). Under the hood the zone type is expanded and collapsed into flat nodes wrapped by `html` nodes with the section markup.

### `sub` and `sup` Types

```html
# CO<sub>2</sub>

40 µg/m<sup>3</sup>
```

Yields following AST:

```js
{
  type: 'root',
  children: [
    {
      type: 'heading',
      depth: 1,
      children: [
        {type: 'text', value: 'CO'},
        {
          type: 'sub',
          children: [
            {type: 'text', value: '2'}
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: '40 µg/m'},
        {
          type: 'sup',
          children: [
            {type: 'text', value: '3'}
          ]
        }
      ]
    }
  ]
}
```

### Meta Data

Yaml meta data on `root.meta`. Powered by `js-yaml` and `remark-frontmatter`.

## Utils

If want only want the features and configure the unified processors yourself, you can import them individually:

```js
import unified from 'unified'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import frontmatter from 'remark-frontmatter'

import * as meta from '@orbiting/remark-preset/lib/meta'
import * as zone from '@orbiting/remark-preset/lib/zone'

unified()
  .use(remarkParse, {
    // your options
  })
  .use(frontmatter, ['yaml'])
  .use(meta.parse)
  .use(zone.collapse({
    test: ({type, value}) => {
      // your logic
    },
    mutate: (start, nodes, end) => {
      // your logic
      return {
        type: 'zone',
        children: nodes
      }
    }
  }))

const stringifier = unified()
  .use(remarkStringify, {
    // your options
  })
  .use(frontmatter, ['yaml'])
  .use(meta.format)
  .use(zone.expand({
    test: ({type}) => type === 'zone',
    mutate: (node) => {
      // your logic
      return [
        {
          type: 'html',
          value: `<section>`
        },
        ...node.children,
        {
          type: 'html',
          value: '</section>'
        }
      ]
    }
  }))
```
