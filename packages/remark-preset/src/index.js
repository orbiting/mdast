import unified from 'unified'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import frontmatter from 'remark-frontmatter'

import * as zone from './zone'
import * as meta from './meta'

const collapseTag = tag => zone.collapse({
  test: ({type, value}) => {
    if (type !== 'html') {
      return
    }
    if (value === `<${tag}>`) {
      return 'start'
    }
    if (value === `</${tag}>`) {
      return 'end'
    }
  },
  mutate: (start, nodes, end) => {
    return {
      type: tag,
      children: nodes
    }
  }
})
const expandTag = tag => zone.expand({
  test: ({type}) => type === tag,
  mutate: node => [
    {
      type: 'html',
      value: `<${tag}>`
    },
    ...node.children,
    {
      type: 'html',
      value: `</${tag}>`
    }
  ]
})

const parser = unified()
  .use(remarkParse, {
    commonmark: true,
    position: false
  })
  .use(frontmatter, ['yaml'])
  .use(meta.parse)
  .use(zone.collapse({
    test: ({type, value}) => {
      if (type !== 'html') {
        return
      }
      if (value.match(/^\s*<section>\s*<h6>([^<]+)<\/h6>/)) {
        return 'start'
      }
      if (value.match(/^\s*<hr\s*\/>\s*<\/section>\s*/)) {
        return 'end'
      }
    },
    mutate: (start, nodes, end) => {
      let data = {}
      const identifier = start.value.match(/<h6>([^<]+)<\/h6>/)[1].trim()
      const dataNode = nodes[0]
      const hasDataNode = dataNode && dataNode.type === 'code'
      if (hasDataNode) {
        data = JSON.parse(dataNode.value)
      }
      return {
        type: 'zone',
        identifier,
        data,
        children: hasDataNode
          ? nodes.slice(1)
          : nodes
      }
    }
  }))
  .use(collapseTag('sub'))
  .use(collapseTag('sup'))

export const parse = md => parser.runSync(parser.parse(md))

const stringifier = unified()
  .use(remarkStringify, {
    bullet: '*',
    fences: true
  })
  .use(frontmatter, ['yaml'])
  .use(meta.format)
  .use(zone.expand({
    test: ({type}) => type === 'zone',
    mutate: (node) => {
      const data = JSON.stringify(node.data || {}, null, 2)
      return [
        {
          type: 'html',
          value: `<section><h6>${node.identifier}</h6>`
        },
        data !== '{}' && {
          type: 'code',
          lang: null,
          value: data
        },
        ...node.children,
        {
          type: 'html',
          value: '<hr /></section>'
        }
      ].filter(Boolean)
    }
  }))
  .use(expandTag('sub'))
  .use(expandTag('sup'))
export const stringify = mdast =>
  stringifier.stringify(stringifier.runSync(mdast))
